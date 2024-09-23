# -*- coding: utf-8 -*-
import requests
import os
import json
from dotenv import load_dotenv
from pathlib import Path
from bs4 import BeautifulSoup
import mysql.connector
import gspread
from gspread.exceptions import APIError
import re
import unidecode
import time

# Load biến môi trường từ file .env.local
env_path = Path('.') / '.env.local'
load_dotenv(dotenv_path=env_path)

# Hàm kết nối đến MySQL
def connect_to_db():
    return mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE")
    )

# Hàm lưu dữ liệu lên Google Sheet
def save_to_google_sheet(sheet_id, sheet_name, data):
    try:
        gc = gspread.service_account(filename='app/crawl/credentials.json')
        sheet = gc.open_by_key(sheet_id).worksheet(sheet_name)
        sheet.clear()
        header = ['Title', 'URL']
        sheet.append_row(header)
        for item in data:
            row = [item['title'], item['url']]
            sheet.append_row(row)
        print(f'Dữ liệu đã được lưu lên Google Sheet trong sheet: {sheet_name}')
    except APIError as e:
        print(f'Lỗi khi lưu dữ liệu lên Google Sheet: {str(e)}')
    except Exception as e:
        print(f'Có lỗi xảy ra: {str(e)}')

# Hàm chuyển tiêu đề thành slug
def generate_slug(title):
    title = unidecode.unidecode(title.lower())
    return re.sub(r'[^a-z0-9]+', '-', title).strip('-')

# Hàm crawl và thêm vào bảng lists hoặc categories
def crawl_and_add_to_table(soup, table_name, url_replace, cursor, db):
    ul_container = soup.find('ul', class_='control nav navbar-nav')
    if not ul_container:
        return []

    li_elements = ul_container.find_all('li', class_='dropdown')
    target_li = li_elements[0] if table_name == 'lists' else li_elements[1]

    list_ul = target_li.find('ul', class_='dropdown-menu') if target_li else None
    if not list_ul:
        return []

    items = list_ul.find_all('li')
    data = []
    for item in items:
        item_name = item.get_text().strip()
        item_link = item.find('a')['href']
        cleaned_item_link = item_link.replace(url_replace, '').strip('/')
        cursor.execute(f"SELECT * FROM {table_name} WHERE name=%s AND slug=%s", (item_name, cleaned_item_link))
        result = cursor.fetchone()

        if not result:
            cursor.execute(f"INSERT INTO {table_name} (name, slug) VALUES (%s, %s)", (item_name, cleaned_item_link))
            db.commit()
            print(f'Thêm mục "{item_name}" vào bảng {table_name} với slug: {cleaned_item_link}')
        else:
            print(f'Mục "{item_name}" đã tồn tại trong bảng {table_name}.')

        data.append({'title': item_name, 'url': item_link})
    return data

# Hàm crawl lists và categories
def crawl_lists_and_categories(cursor, db):
    url = 'https://truyenfull.io/'
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Crawl và thêm vào bảng lists
        lists = crawl_and_add_to_table(soup, 'lists', 'https://truyenfull.io/danh-sach/', cursor, db)

        # Crawl và thêm vào bảng categories
        categories = crawl_and_add_to_table(soup, 'categories', 'https://truyenfull.io/the-loai/', cursor, db)

        return lists, categories

    except requests.exceptions.RequestException as e:
        print(f'Yêu cầu gặp lỗi: {e}')
        return [], []

# Hàm lấy số trang đầu tiên và số trang cuối cùng
def get_first_and_last_page(soup):
    pagination = soup.find('ul', class_='pagination pagination-sm')
    if pagination:
        page_items = pagination.find_all('li')
        first_page = int(re.search(r'\d+', page_items[0].get_text(strip=True)).group(0)) if page_items else 1
        last_page_item = page_items[-2].find('a', href=True) if page_items else None
        if last_page_item:
            last_page_number_match = re.search(r'trang-(\d+)', last_page_item['href'])
            if last_page_number_match:
                return first_page, int(last_page_number_match.group(1))
    return 1, 1

# Crawl tất cả các trang truyện từ danh sách lists hoặc categories
def crawl_all_pages(data_list):
    data_stories = []
    for data in data_list:
        initial_url = f'{data["url"]}hoan/'
        print(f'Đang crawl URL: {initial_url}')
        response = requests.get(initial_url)

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            first_page, _ = get_first_and_last_page(soup)

            for page_number in range(first_page, 2):  # Giới hạn crawl để tránh quá tải
                print(f'Đang crawl trang {page_number} cho URL: {initial_url}')
                stories = crawl_page(page_number, initial_url, data['url'])
                if stories:
                    data_stories.extend(stories)
                else:
                    print(f"Không thể crawl trang {page_number} cho URL: {initial_url}")
        else:
            print(f'Không thể truy cập URL: {data["url"]}, mã lỗi: {response.status_code}')
    return data_stories

# Hàm lấy danh sách chương từ trang
def get_chapters_from_page(url):
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Lỗi khi yêu cầu {url}: {response.status_code}")
        return []

    soup = BeautifulSoup(response.text, 'html.parser')
    chapter_list = soup.find_all('ul', class_='list-chapter')

    chapters = []
    for ul in chapter_list:
        chapter_tags = ul.find_all('a')
        for chapter in chapter_tags:
            title = chapter['title']
            link = chapter['href']
            chapter_number = re.search(r'Chương (\d+)', title).group(1) if 'Chương' in title else ''
            chapter_title = title.split(': ')[1].strip() if ': ' in title else ''
            chapters.append({
                'chapter_number': chapter_number,
                'chapter_title': chapter_title,
                'url': link
            })
    return chapters

# Hàm crawl chi tiết truyện
def get_story_details(href):
    response = requests.get(href)
    if response.status_code != 200:
        print(f"Lỗi khi lấy thông tin chi tiết: {href}, mã lỗi: {response.status_code}")
        return None

    soup = BeautifulSoup(response.text, 'html.parser')
    description = soup.find('div', class_='desc-text desc-text-full').text.strip() if soup.find('div', class_='desc-text desc-text-full') else None
    chapters = get_chapters_from_page(href)
    print(f"Tổng số chương: {len(chapters)}")
    return {'description': description, 'chapters': chapters}

# Hàm lấy nội dung của chương
def get_chapter_content(url):
    time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        chapter_content_div = soup.find('div', id='chapter-c')
        if chapter_content_div:
            for div in chapter_content_div.find_all('div'):
                div.decompose()  # Loại bỏ thẻ div không cần thiết
            return chapter_content_div.get_text(separator='\n', strip=True)
    print(f"Lỗi khi yêu cầu nội dung {url}: {response.status_code}")
    return ""

# Hàm lưu truyện và chương vào cơ sở dữ liệu
def save_story_and_chapters(story_info, chapters, cat_name, table_name):
    conn = connect_to_db()
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM authors WHERE slug = %s", (generate_slug(story_info['author']),))
    author = cursor.fetchone()
    author_id = author[0] if author else None

    if not author_id:
        cursor.execute("INSERT INTO authors (name, slug) VALUES (%s, %s)", (story_info['author'], generate_slug(story_info['author'])))
        conn.commit()
        author_id = cursor.lastrowid

    cursor.execute("SELECT id FROM stories WHERE slug = %s", (story_info['slug'],))
    story = cursor.fetchone()
    story_id = story[0] if story else None

    if not story_id:
        cursor.execute("""
            INSERT INTO stories (title, slug, description, avatar_image, author_id, status, labels, view_count, total_chapter)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            story_info['title'],
            story_info['slug'],
            story_info.get('description', ''),
            json.dumps(story_info['img_src_desk']),
            author_id,
            'Full',
            json.dumps(story_info['labels']),
            0,
            story_info['total_chapter']
        ))
        conn.commit()
        story_id = cursor.lastrowid

    cursor.execute(f"SELECT id FROM {cat_name} WHERE slug = %s", (story_info['genres'],))
    category_id = cursor.fetchone()
    if category_id:
        category_id = category_id[0]
        cursor.execute(f"SELECT * FROM {table_name} WHERE story_id = %s AND category_id = %s", (story_id, category_id,))
        story_category = cursor.fetchone()
        if not story_category:
            cursor.execute(f"INSERT INTO {table_name} (story_id, category_id) VALUES (%s, %s)", (story_id, category_id))
            conn.commit()

    for chapter in chapters:
        cursor.execute("SELECT id FROM chapters WHERE story_id = %s AND chapter_number = %s", (story_id, chapter['chapter_number']))
        if cursor.fetchone() is None:
            content = get_chapter_content(chapter['url'])
            cursor.execute("INSERT INTO chapters (story_id, title, content, chapter_number) VALUES (%s, %s, %s, %s)",
                           (story_id, chapter['chapter_title'], content, chapter['chapter_number']))
            conn.commit()

    cursor.close()
    conn.close()

# Crawl danh sách truyện từ một trang
def crawl_page(page_number, init_url, init_slug):
    url = init_url + f'/trang-{page_number}/'
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        list_truyen_container = soup.find('div', class_='list list-truyen col-xs-12')
        if not list_truyen_container:
            return []

        books = []
        book_rows = list_truyen_container.find_all('div', class_='row', itemtype='https://schema.org/Book')
        for book in book_rows:
            title_tag = book.find('h3', class_='truyen-title', itemprop="name")
            title_link = title_tag.find('a') if title_tag else None
            title = title_link['title'] if title_link else None
            slug = generate_slug(title) if title else None
            href = title_link['href'] if title_link else None

            img_tag = book.find('div', class_='lazyimg')
            img_src_desk = img_tag['data-desk-image'] if img_tag else None
            img_src = img_tag['data-image'] if img_tag else None

            author_tag = book.find('span', class_='author')
            author = author_tag.get_text(strip=True) if author_tag else None
            label_tags = book.find_all('span', class_='label-title')
            labels = [label['class'][1].replace('label-', '') for label in label_tags]

            text_info_tag = book.find('div', class_='text-info')
            chapter_tag = text_info_tag.find('a') if text_info_tag else None
            chapter_text = chapter_tag.get_text(strip=True) if chapter_tag else None
            chapter_number = re.search(r'\d+', chapter_text).group() if chapter_text else None

            books.append({
                'title': title,
                'slug': slug,
                'author': author,
                'genres': extract_slug(init_slug),
                'url': href,
                'img_src_desk': img_src_desk,
                'img_src_mb': img_src,
                'labels': labels,
                'total_chapter': chapter_number,
            })
        return books
    print(f'Không thể truy cập trang {page_number} với URL: {init_url}, mã lỗi: {response.status_code}')
    return []

# Hàm đọc dữ liệu từ file JSON và sử dụng
def use_data_from_json():
    try:
        with open('app/crawl/truyenfull.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data.get('lists', []), data.get('categories', [])
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Lỗi khi đọc file JSON: {e}")
        return [], []

# Chạy chương trình chính
if __name__ == '__main__':
    db = connect_to_db()
    cursor = db.cursor()

    try:
        lists, categories = use_data_from_json()  # Sử dụng dữ liệu từ JSON

        # Crawl tất cả các trang trong lists và categories
        allList = crawl_all_pages(lists)
        allCat = crawl_all_pages(categories)

        # Xử lý allList và allCat
        for story in allList:
            print(f"Lấy chi tiết truyện từ URL: {story['url']}")
            details = get_story_details(story['url'])
            if details:
                story['description'] = details.get('description')
                story['chapters'] = details.get('chapters')
                save_story_and_chapters(story, story['chapters'], 'lists', 'story_lists')

        for story in allCat:
            print(f"Lấy chi tiết truyện từ URL: {story['url']}")
            details = get_story_details(story['url'])
            if details:
                story['description'] = details.get('description')
                story['chapters'] = details.get('chapters')
                save_story_and_chapters(story, story['chapters'], 'categories', 'story_categories')

    finally:
        cursor.close()
        db.close()
