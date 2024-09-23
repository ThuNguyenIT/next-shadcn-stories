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

# Định nghĩa headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Connection': 'keep-alive'
}

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
    slug = re.sub(r'[^a-z0-9]+', '-', title).strip('-')
    return slug

# Crawl và thêm vào bảng lists
def crawl_and_add_to_list(soup, cursor, db):
    ul_container = soup.find('ul', class_='control nav navbar-nav')

    if ul_container:
        li_elements = ul_container.find_all('li', class_='dropdown')
        if li_elements[0]:
            list_ul = li_elements[0].find('ul', class_='dropdown-menu')

            if list_ul:
                list_items = list_ul.find_all('li')
                lists = []
                for item in list_items:
                    item_name = item.get_text().strip()
                    item_link = item.find('a')['href']
                    lists.append({ 'title': item_name, 'url': item_link })

                    cleaned_item_link = item_link.replace('https://truyenfull.io/danh-sach/', '').strip('/')
                    cursor.execute("SELECT * FROM lists WHERE name=%s AND slug=%s", (item_name, cleaned_item_link))
                    result = cursor.fetchone()

                    if result:
                        print(f'Mục "{item_name}" đã tồn tại trong bảng lists.')
                    else:
                        cursor.execute("INSERT INTO lists (name, slug) VALUES (%s, %s)", (item_name, cleaned_item_link))
                        db.commit()
                        print(f'Thêm mục "{item_name}" vào bảng lists với slug: {cleaned_item_link}')
                return lists

# Crawl và thêm vào bảng categories
def crawl_and_add_to_category(soup, cursor, db):
    ul_container = soup.find('ul', class_='control nav navbar-nav')

    if ul_container:
        li_elements = ul_container.find_all('li', class_='dropdown')
        if li_elements[1]:
            list_ul = li_elements[1].find_all('ul', class_='dropdown-menu')
            if list_ul:
                categories = []
                for ul in list_ul:
                    list_items = ul.find_all('li')
                    for item in list_items:
                        item_name = item.get_text().strip()
                        item_link = item.find('a')['href']
                        categories.append({ 'title': item_name, 'url': item_link })

                        cleaned_item_link = item_link.replace('https://truyenfull.io/the-loai/', '').strip('/')
                        cursor.execute("SELECT * FROM categories WHERE name=%s AND slug=%s", (item_name, cleaned_item_link))
                        result = cursor.fetchone()

                        if result:
                            print(f'Mục "{item_name}" đã tồn tại trong bảng categories.')
                        else:
                            cursor.execute("INSERT INTO categories (name, slug) VALUES (%s, %s)", (item_name, cleaned_item_link))
                            db.commit()
                            print(f'Thêm mục "{item_name}" vào bảng categories với slug: {cleaned_item_link}')
                return categories

# Hàm crawl lists và categories
def crawl_lists_and_categories(cursor, db):
    url = 'https://truyenfull.io/'
    try:
        response = requests.get(url, headers=headers)
        time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu

        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Crawl và thêm vào bảng lists
        lists = crawl_and_add_to_list(soup, cursor, db)
        # save_to_google_sheet("1x0fes9vsalXRqAQgfsys6ZHwMBGlrPHfOG4xn2TK-Hk", "List", lists)

        # Crawl và thêm vào bảng categories
        categories = crawl_and_add_to_category(soup, cursor, db)
        # save_to_google_sheet("1x0fes9vsalXRqAQgfsys6ZHwMBGlrPHfOG4xn2TK-Hk", "Category", categories)

        # Xuất lists và categories ra file JSON
        # data = {
        #     "lists": lists,
        #     "categories": categories
        # }
        # with open('app/crawl/truyenfull.json', 'w', encoding='utf-8') as f:
        #     json.dump(data, f, ensure_ascii=False, indent=4)
        # print('Dữ liệu đã được lưu vào file truyenfull.json')

        return lists, categories

    except requests.exceptions.RequestException as e:
        print(f'Yêu cầu gặp lỗi: {e}')

# Hàm lấy số trang đầu tiên và số trang cuối cùng
def get_first_and_last_page(soup):
    pagination = soup.find('ul', class_='pagination pagination-sm')
    if pagination:
        page_items = pagination.find_all('li')
        if page_items:
            first_page_text = page_items[0].get_text(strip=True)
            first_page_number = re.search(r'\d+', first_page_text)
            if first_page_number:
                first_page_number = int(first_page_number.group(0))
            else:
                first_page_number = 1
            last_page_item = page_items[-2].find('a', href=True)
            if last_page_item:
                last_page_url = last_page_item['href']
                last_page_number_match = re.search(r'trang-(\d+)', last_page_url)
                if last_page_number_match:
                    last_page_number = int(last_page_number_match.group(1))
                    return first_page_number, last_page_number
    return 1, 1

# Crawl tất cả các trang truyện từ danh sách lists và categories
def crawl_all_pages(lists):
    dataStories = []
    for list in lists:
        initial_url = f'{list['url']}hoan/'
        print(f'Đang crawl URL slug: {initial_url}')
        response = requests.get(initial_url, headers=headers)
        time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu

        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            first_page, last_page = get_first_and_last_page(soup)

            # for page_number in range(first_page, last_page + 1):
            for page_number in range(first_page, 2):
                print(f'Đang crawl trang {page_number} cho URL slug: {initial_url}')
                stories = crawl_page(page_number, initial_url, list['url'])

                # Kiểm tra nếu stories là None, nếu không, thêm vào dataStories
                if stories is not None:
                    dataStories.extend(stories)
                else:
                    print(f"Không thể crawl trang {page_number} cho URL slug: {initial_url}")
        else:
            print(f'Không thể truy cập trang web với URL slug: {list['url']}, mã lỗi: {response.status_code}')
    return dataStories

# Hàm lấy danh sách chương từ trang
def get_chapters_from_page(url):
    response = requests.get(url, headers=headers)
    time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        chapter_list = soup.find_all('ul', class_='list-chapter')

        chapters = []
        for ul in chapter_list:
            chapter_tags = ul.find_all('a')
            for chapter in chapter_tags:
                title = chapter['title']
                link = chapter['href']

                # Xử lý title và chapter number
                if 'Chương' in title and ': ' in title:
                    chapter_number = title.split('Chương ')[1].split(':')[0].strip()
                    chapter_title = title.split(': ')[1].strip()
                elif 'Chương' in title:
                    chapter_number = title.split('Chương ')[1].strip()
                    chapter_title = ''
                else:
                    chapter_number = ''
                    chapter_title = title.strip()

                # Thêm vào danh sách chapters
                chapters.append({
                    'chapter_number': chapter_number,
                    'chapter_title': chapter_title,
                    'url': link
                })
        return chapters
    else:
        print(f"Lỗi khi yêu cầu {url}: {response.status_code}")
        return []

# Hàm crawl chi tiết truyện
def get_story_details(href):
    # Kiểm tra nếu href là None hoặc không hợp lệ
    if not href or not href.startswith('http'):
        print(f"URL không hợp lệ: {href}")
        return None
    
    detail_response = requests.get(href, headers=headers)
    time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu

    if detail_response.status_code == 200:
        detail_soup = BeautifulSoup(detail_response.text, 'html.parser')
        description_tag = detail_soup.find('div', class_='desc-text desc-text-full')
        description = description_tag.text.strip() if description_tag else None
        chapters = get_chapters_from_page(href)
        print(f"Tổng số chương: {len(chapters)}")
        return {
            'description': description,
            'chapters': chapters
        }
    else:
        print(f"Lỗi khi lấy thông tin chi tiết: {href}, mã lỗi: {detail_response.status_code}")
        return None

# Hàm lấy nội dung của chương
def get_chapter_content(url):
    response = requests.get(url, headers=headers)
    time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        chapter_content_div = soup.find('div', id='chapter-c')
        if chapter_content_div:
            for div in chapter_content_div.find_all('div'):
                div.decompose()  # Loại bỏ thẻ div không cần thiết
            return chapter_content_div.get_text(separator='\n', strip=True)
    else:
        print(f"Lỗi khi yêu cầu nội dung {url}: {response.status_code}")
    return ""

def save_story_and_chapters(story_info, chapters, cat_name, table_name):
    # Kết nối MySQL
    conn = connect_to_db()
    cursor = conn.cursor()

    # Kiểm tra và lấy ID của tác giả
    cursor.execute("SELECT id FROM authors WHERE slug = %s", (generate_slug(story_info['author']),))
    author = cursor.fetchone()

    if author is None:
        # Thêm mới tác giả nếu chưa tồn tại
        cursor.execute("INSERT INTO authors (name, slug) VALUES (%s, %s)", (story_info['author'], generate_slug(story_info['author']),))
        conn.commit()
        author_id = cursor.lastrowid
    else:
        author_id = author[0]

    # Kiểm tra và lấy ID của truyện
    cursor.execute("SELECT id FROM stories WHERE slug = %s", (story_info['slug'],))
    story = cursor.fetchone()

    if story is None:
        # Thêm mới truyện nếu chưa tồn tại
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
    else:
        # Cập nhật thông tin truyện nếu đã tồn tại
        story_id = story[0]
        # cursor.execute("""
        #     UPDATE stories
        #     SET title = %s, description = %s, avatar_image = %s, author_id = %s, status = %s, labels = %s, total_chapter = %s
        #     WHERE id = %s
        # """, (
        #     story_info['title'],
        #     story_info.get('description', ''),
        #     json.dumps(story_info['img_src_desk']),
        #     author_id,
        #     'Full',
        #     json.dumps(story_info['labels']),
        #     story_info['total_chapter'],
        #     story_id
        # ))
        # conn.commit()

    # Kiểm tra và thêm mới thể loại nếu chưa có
    if story_info['genres']:
        # Sử dụng f-string đúng cách để thay thế cat_name vào câu truy vấn SQL
        cursor.execute(f"SELECT id FROM {cat_name} WHERE slug = %s", (story_info['genres'],))
        category_id = cursor.fetchone()

        if category_id:
            category_id = category_id[0]
            # Kiểm tra sự tồn tại của cặp story_id và category_id trong table_name
            cursor.execute(f"SELECT * FROM {table_name} WHERE story_id = %s AND category_id = %s", (story_id, category_id,))
            story_category = cursor.fetchone()

            if story_category is None:
                # Nếu chưa tồn tại, thực hiện INSERT
                cursor.execute(f"""
                    INSERT INTO {table_name} (story_id, category_id)
                    VALUES (%s, %s)
                """, (story_id, category_id))
                conn.commit()

    # Lưu danh sách chương vào cơ sở dữ liệu
    for chapter in chapters:
        # Kiểm tra sự tồn tại của chương trước khi chèn
        cursor.execute("SELECT id FROM chapters WHERE story_id = %s AND chapter_number = %s", (story_id, chapter['chapter_number']))
        existing_chapter = cursor.fetchone()

        if existing_chapter is None:
            # Thêm mới chương nếu chưa có
            content = get_chapter_content(chapter['url'])
            cursor.execute("""
                INSERT INTO chapters (story_id, title, content, chapter_number)
                VALUES (%s, %s, %s, %s)
            """, (story_id, chapter['chapter_title'], content, chapter['chapter_number']))
            conn.commit()
        else:
            print(f"Chương {chapter['chapter_number']} đã tồn tại cho truyện {story_info['title']} (ID: {story_id}).")
            # Cập nhật chương nếu đã tồn tại
            # chapter_id = existing_chapter[0]
            # content = get_chapter_content(chapter['url'])
            # cursor.execute("""
            #     UPDATE chapters
            #     SET title = %s, content = %s
            #     WHERE id = %s
            # """, (chapter['chapter_title'], content, chapter_id))
            # conn.commit()
        time.sleep(0.5)
            
    print('Dữ liệu đã được lưu hoặc cập nhật vào cơ sở dữ liệu.')
    cursor.close()
    conn.close()

def extract_slug(url):
    # Tách chuỗi theo dấu '/' và lấy phần trước cuối cùng
    parts = url.strip('/').split('/')
    
    # Lấy phần cuối cùng của URL, đó chính là slug
    return parts[-1]

# Crawl danh sách truyện từ một trang
def crawl_page(page_number, init_url, init_slug):
    url = init_url + f'/trang-{page_number}/'
    response = requests.get(url, headers=headers)
    time.sleep(1)   # Thêm thời gian chờ giữa các yêu cầu
    
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        list_truyen_container = soup.find('div', class_='list list-truyen col-xs-12')

        if list_truyen_container:
            book_rows = list_truyen_container.find_all('div', class_='row', itemtype='https://schema.org/Book')
            books = []
            for book in book_rows:
                img_tag = book.find('div', class_='lazyimg')
                img_src_desk = img_tag['data-desk-image'] if img_tag else None
                img_src = img_tag['data-image'] if img_tag else None

                title_tag = book.find('h3', class_='truyen-title', itemprop="name")
                if title_tag:
                    title_link = title_tag.find('a')
                    title = title_link['title'] if title_link else None
                    slug = generate_slug(title) if title else None
                    href = title_link['href'] if title_link else None
                else:
                    title = slug = href = None

                author_tag = book.find('span', class_='author')
                author = author_tag.get_text(strip=True) if author_tag else None
                label_tags = book.find_all('span', class_='label-title')
                labels = [label['class'][1].replace('label-', '') for label in label_tags]

                text_info_tag = book.find('div', class_='text-info')
                if text_info_tag:
                    chapter_tag = text_info_tag.find('a')
                    chapter_text = chapter_tag.get_text(strip=True) if chapter_tag else None
                    if chapter_text:
                        chapter_match = re.search(r'\d+', chapter_text)
                        chapter_number = chapter_match.group() if chapter_match else None
                    else:
                        chapter_number = None
                else:
                    chapter_number = None
                
                story_data = {
                    'title': title,
                    'slug': slug,
                    'author': author,
                    'genres': extract_slug(init_slug),
                    'url': href,
                    'img_src_desk': img_src_desk,
                    'img_src_mb': img_src,
                    'labels': labels,
                    'total_chapter': chapter_number,
                }
                books.append(story_data)
            return books
    else:
        print(f'Không thể truy cập trang {page_number} với URL slug: {init_url}, mã lỗi: {response.status_code}')

# Hàm đọc dữ liệu từ file JSON và sử dụng
def use_data_from_json():
    try:
        # Đọc file JSON
        with open('app/crawl/truyenfull.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Lấy lists và categories từ file JSON
        lists = data.get('lists', [])
        categories = data.get('categories', [])
        
        return lists, categories
    except FileNotFoundError:
        print("File 'truyenfull.json' không tồn tại. Vui lòng kiểm tra đường dẫn.")
        return [], []
    except json.JSONDecodeError as e:
        print(f"File JSON không hợp lệ: {e}")
        return [], []
    
# Chạy chương trình chính
if __name__ == '__main__':
    db = connect_to_db()
    cursor = db.cursor()

    try:
        # lists, categories = crawl_lists_and_categories(cursor, db)
        lists, categories = use_data_from_json()  # Sử dụng dữ liệu từ JSON

        # Crawl tất cả các trang trong lists
        allList = crawl_all_pages(lists)
        for story in allList:
            if 'url' in story and story['url']:
                print(f"Lấy chi tiết truyện từ URL: {story['url']}")
                details = get_story_details(story['url'])
                if details:
                    story['description'] = details.get('description')
                    story['chapters'] = details.get('chapters')
                    save_story_and_chapters(story, story['chapters'], 'lists', 'story_lists')
            else:
                print(f"URL không hợp lệ cho câu chuyện: {story}")
        
        # Crawl tất cả các trang trong categories
        allCat = crawl_all_pages(categories)
        for story in allCat:
            if 'url' in story and story['url']:
                print(f"Lấy chi tiết truyện từ URL: {story['url']}")
                details = get_story_details(story['url'])
                if details:
                    story['description'] = details.get('description')
                    story['chapters'] = details.get('chapters')
                    save_story_and_chapters(story, story['chapters'], 'categories', 'story_categories')
            else:
                print(f"URL không hợp lệ cho câu chuyện: {story}")

    finally:
        cursor.close()
        db.close()
