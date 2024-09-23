# -*- coding: utf-8 -*-
import os
import re
import json
import unidecode
import requests
from dotenv import load_dotenv
from pathlib import Path
from bs4 import BeautifulSoup
import mysql.connector

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

# Hàm chuyển tiêu đề thành slug
def generate_slug(title):
    # Loại bỏ dấu tiếng Việt và chuyển sang chữ thường
    title = unidecode.unidecode(title.lower())
    # Loại bỏ ký tự đặc biệt và thay thế khoảng trắng bằng dấu gạch ngang
    slug = re.sub(r'[^a-z0-9]+', '-', title).strip('-')
    return slug

def convert_to_slug(name):
    # Chuyển tất cả ký tự thành chữ thường
    name = name.lower()
    # Thay thế khoảng trắng hoặc dấu khác bằng dấu gạch ngang
    name = re.sub(r'\s+', '-', name)
    # Loại bỏ các ký tự không phải là chữ cái hoặc số
    name = re.sub(r'[^\w\-]', '', name)
    return name

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

def download_image(image_url, file_name):
    # Tải về hình ảnh từ URL
    response = requests.get(image_url)
    if response.status_code == 200:
        with open(file_name, 'wb') as f:
            f.write(response.content)
        print(f"Image downloaded: {file_name}")
    else:
        print("Failed to download image")
    return file_name

def upload_to_uploadthing(file_path, upload_url):
    # Lấy API Key từ biến môi trường
    api_key = os.getenv('UPLOADTHING_SECRET')

    headers = {
        'api-key': api_key,  # Thêm API Key vào header
        'Content-Type': 'multipart/form-data'  # Đảm bảo Content-Type được định nghĩa đúng
    }
    
    # Tạo request multipart/form-data để upload file
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(upload_url, files=files, headers=headers)

    if response.status_code == 200:
        print(f"File uploaded successfully: {response.json()}")
    else:
        print(f"Failed to upload file: {response.status_code}, {response.text}")

# Check if author exists or create new one
def get_or_create_author(cursor, author_name, author_email=None):
    # Tạo slug từ tên tác giả
    slug_author = convert_to_slug(author_name)
    
    # Kiểm tra xem tác giả đã tồn tại chưa trong bảng authors
    cursor.execute("SELECT id FROM authors WHERE slug=%s", (slug_author,))
    author = cursor.fetchone()

    if author:
        print(f'Author "{author_name}" already exists with ID {author[0]}.')
        return author[0]
    
    # Nếu tác giả chưa tồn tại, tạo tác giả mới
    # Nếu email không được cung cấp, sử dụng giá trị None (NULL trong database)
    cursor.execute("INSERT INTO authors (name, slug, email) VALUES (%s, %s, %s)",
                   (author_name, slug_author, author_email))
    db.commit()
    print(f'Author "{author_name}" created successfully.')
    return cursor.lastrowid

# Check if the story exists and create it if not
def get_or_create_story(cursor, story_data, author_id):
    # Check if the story already exists in the database based on slug
    cursor.execute("SELECT id FROM stories WHERE slug=%s", (story_data['slug'],))
    story = cursor.fetchone()

    if story:
        print(f'Story "{story_data["title"]}" already exists with slug: {story_data["slug"]}.')
        return story[0]
    
    # If not, create a new story entry
    cursor.execute(
        "INSERT INTO stories (title, slug, description, avatar_image, cover_image, author_id, labels, view_count, status, total_chapter) "
        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
        (story_data['title'], story_data['slug'], None, json.dumps(story_data['img_src_desk']), json.dumps(story_data['img_src_mb']),
         author_id, json.dumps(story_data['labels']), 0, 'active', story_data['total_chapter'])
    )
    db.commit()
    return cursor.lastrowid

# Check if list exists or create new one
def get_or_create_list(cursor, list_name):
    slug_list = convert_to_slug(list_name)
    
    # Check if the list already exists in the lists table
    cursor.execute("SELECT id FROM lists WHERE slug=%s", (slug_list,))
    list_entry = cursor.fetchone()

    if list_entry:
        return list_entry[0]
    
    # If the list does not exist, create a new one
    cursor.execute("INSERT INTO lists (name, slug) VALUES (%s, %s)", (list_name, slug_list))
    db.commit()
    return cursor.lastrowid

# Check if category exists or create new one
def get_or_create_category(cursor, category_name):
    slug_category = convert_to_slug(category_name)
    
    # Check if the category already exists in the categories table
    cursor.execute("SELECT id FROM categories WHERE slug=%s", (slug_category,))
    category = cursor.fetchone()

    if category:
        return category[0]
    
    # If the category does not exist, create a new one
    cursor.execute("INSERT INTO categories (name, slug) VALUES (%s, %s)", (category_name, slug_category))
    db.commit()
    return cursor.lastrowid

# Associate a story with a list in story_lists table
def add_story_to_list(cursor, story_id, list_id):
    # Check if this relation already exists
    cursor.execute("SELECT * FROM story_lists WHERE story_id=%s AND list_id=%s", (story_id, list_id))
    story_list = cursor.fetchone()

    if not story_list:
        # Create new relation if it doesn't exist
        cursor.execute("INSERT INTO story_lists (story_id, list_id) VALUES (%s, %s)", (story_id, list_id))
        db.commit()

# Associate a story with a category in story_categories table
def add_story_to_category(cursor, story_id, category_id):
    # Check if this relation already exists
    cursor.execute("SELECT * FROM story_categories WHERE story_id=%s AND category_id=%s", (story_id, category_id))
    story_category = cursor.fetchone()

    if not story_category:
        # Create new relation if it doesn't exist
        cursor.execute("INSERT INTO story_categories (story_id, category_id) VALUES (%s, %s)", (story_id, category_id))
        db.commit()

# Hàm crawl danh sách truyện từ một trang
def crawl_page(page_number, init_url, init_title, cat_type):
    url = init_url + f'/trang-{page_number}/'
    response = requests.get(url)
    
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

                title_tag = book.find('h3', class_='truyen-title').find('a')
                title = title_tag['title'] if title_tag else None
                slug = generate_slug(title) if title else None
                href = title_tag['href'] if title_tag else None
                author_tag = book.find('span', class_='author')
                author = author_tag.get_text(strip=True) if author_tag else None
                label_tags = book.find_all('span', class_='label-title')
                labels = [label['class'][1].replace('label-', '') for label in label_tags]
                
                # Safely handle chapter extraction
                chapter_tag = book.find('div', class_='text-info').find('a')
                chapter_text = chapter_tag.get_text(strip=True) if chapter_tag else None
                if chapter_text:
                    chapter_match = re.search(r'\d+', chapter_text)
                    chapter_number = chapter_match.group() if chapter_match else None
                else:
                    chapter_number = None

                story_data = {
                    'title': title,
                    'slug': slug,
                    'url': href,
                    'img_src_desk': img_src_desk,
                    'img_src_mb': img_src,
                    'author': author,
                    'labels': labels,
                    'total_chapter': chapter_number
                }

                books.append(story_data)

                author_id = get_or_create_author(cursor, author)
                if author_id:
                    story_id = get_or_create_story(cursor, story_data, author_id)
                    print(f'Story "{title}" with ID {story_id} added to the database.')

                    if story_id:
                        # Add story to lists or categories
                        if cat_type == 1:
                            list_id = get_or_create_list(cursor, init_title)
                            add_story_to_list(cursor, story_id, list_id)
                        else:
                            category_id = get_or_create_category(cursor, init_title)
                            add_story_to_category(cursor, story_id, category_id)
                    else:
                        print(f'Skipping story "{title}" because no story could be created.')
                else:
                    print(f'Skipping story "{title}" because no author could be created.')

                print(f'Url: {href}')
                print(f'Tiêu đề: {title}')
                print(f'Slug: {slug}')
                print(f'Ảnh bìa desk: {img_src_desk}')
                print(f'Ảnh bìa mb: {img_src}')
                print(f'Tác giả: {author}')
                print(f'Labels: {", ".join(labels)}')
                print(f'Tổng số chương: {chapter_number}')
                print('-' * 50)

            return books
    else:
        print(f'Không thể truy cập trang {page_number} với URL slug: {init_url}, mã lỗi: {response.status_code}')

# Hàm lấy số trang đầu tiên và số trang cuối cùng
def get_first_and_last_page(soup):
    pagination = soup.find('ul', class_='pagination pagination-sm')
    if pagination:
        page_items = pagination.find_all('li')  # Tìm tất cả các thẻ <li> bên trong pagination

        # Lấy số page đầu tiên (chỉ phần số của thẻ li đầu tiên)
        if page_items:
            first_page_text = page_items[0].get_text(strip=True)
            # Sử dụng regex để chỉ lấy số từ chuỗi văn bản
            first_page_number = re.search(r'\d+', first_page_text)
            if first_page_number:
                first_page_number = int(first_page_number.group(0))
            else:
                first_page_number = 1  # Mặc định là 1 nếu không tìm thấy
            print(f'Số trang đầu tiên (text): {first_page_number}')

        # Lấy số page cuối cùng từ href của thẻ <a> trong thẻ li cuối cùng
        last_page_item = page_items[-2].find('a', href=True)  # Bỏ qua thẻ <li> cuối là "dropup" hoặc "Chọn trang"
        if last_page_item:
            last_page_url = last_page_item['href']
            last_page_number_match = re.search(r'trang-(\d+)', last_page_url)  # Tìm số trang trong URL
            if last_page_number_match:
                last_page_number = int(last_page_number_match.group(1))
                print(f'Số trang cuối cùng (từ URL): {last_page_number}')
                return first_page_number, last_page_number
        else:
            print("Không tìm thấy thẻ <a> cuối cùng")
    return 1, 1  # Trả về mặc định nếu không tìm thấy pagination

# Hàm crawl tất cả các trang truyện từ danh sách lists và categories
def crawl_all_pages(lists, type):
    for list in lists:
        title = list['title']
        url = list['slug']
        # Crawl trang đầu tiên của mỗi mục trong lists và categories
        initial_url = f'{url}hoan/'
        print(f'Đang crawl URL slug: {initial_url}')
        response = requests.get(initial_url)

        dataStories = []
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            first_page, last_page = get_first_and_last_page(soup)

            for page_number in range(first_page, last_page + 1):
                print(f'Đang crawl trang {page_number} cho URL slug: {initial_url}')
                print('-' * 50)
                stories = crawl_page(page_number, initial_url, title, type)
                dataStories.append(stories)
        else:
            print(f'Không thể truy cập trang web với URL slug: {url}, mã lỗi: {response.status_code}')

        return dataStories

# Lấy danh sách chương từ URL
def get_chapters_from_page(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        chapter_list = soup.find_all('ul', class_='list-chapter')

        chapters = []
        for ul in chapter_list:
            chapter_tags = ul.find_all('a')
            for chapter in chapter_tags:
                title = chapter['title']
                link = chapter['href']
                chapter_number = title.split('Chương ')[1].split(':')[0].strip()
                chapter_title = title.split(': ')[1].strip()
                chapters.append({'chapter_number': chapter_number, 'chapter_title': chapter_title, 'url': link})
        return chapters
    else:
        print(f"Lỗi khi yêu cầu {url}: {response.status_code}")
        return []

# Hàm crawl chi tiết truyện
def get_story_details(href):
    """
    Hàm này lấy thông tin chi tiết của truyện từ URL được cung cấp.
    """
    # Gửi yêu cầu GET để lấy thông tin chi tiết của truyện
    detail_response = requests.get(href)
    if detail_response.status_code == 200:
        detail_soup = BeautifulSoup(detail_response.text, 'html.parser')

        # Lấy thông tin mô tả
        description_tag = detail_soup.find('div', class_='desc-text desc-text-full')
        description = description_tag.text.strip() if description_tag else None
        print(f"Mô tả: {description}")

        # Lấy danh sách chương từ URL
        chapters = get_chapters_from_page(href)
        print(f"Tổng số chương: {len(chapters)}")
        for chapter in chapters:
            print(f"  - Số chương: {chapter['chapter_number']}, Tiêu đề: {chapter['chapter_title']}, Url: {chapter['url']}")

        # Trả về dữ liệu chi tiết truyện
        return {
            'description': description,
            'chapters': chapters
        }
    else:
        print(f"Lỗi khi lấy thông tin chi tiết: {href}, mã lỗi: {detail_response.status_code}")
        return None

# Chạy chương trình chính
if __name__ == '__main__':
    # Kết nối đến MySQL
    db = connect_to_db()
    cursor = db.cursor()
    
    try:
        lists, categories = use_data_from_json()  # Sử dụng dữ liệu từ JSON
        print(f"lists: {lists}")
        print(f"categories: {categories}")
        
        # Crawl danh sách từ các trang
        allList = crawl_all_pages(lists, 1)
        allCat = crawl_all_pages(categories, 2)
        
        # Xử lý allList (ví dụ: truyện trong danh sách)
        for story in allList:
            print(f"Lấy chi tiết truyện từ URL: {story['url']}")
            details = get_story_details(story['url'])  # Gọi hàm lấy chi tiết truyện
            if details:
                story['description'] = details.get('description')
                story['chapters'] = details.get('chapters')
                print(f"Chi tiết truyện: {story}")
                # Thực hiện lưu hoặc cập nhật chi tiết truyện trong database nếu cần
                
        # Xử lý allCat (ví dụ: truyện trong các danh mục)
        for story in allCat:
            print(f"Lấy chi tiết truyện từ URL: {story['url']}")
            details = get_story_details(story['url'])  # Gọi hàm lấy chi tiết truyện
            if details:
                story['description'] = details.get('description')
                story['chapters'] = details.get('chapters')
                print(f"Chi tiết truyện: {story}")
                # Thực hiện lưu hoặc cập nhật chi tiết truyện trong database nếu cần

    except requests.exceptions.RequestException as e:
        print(f'Yêu cầu gặp lỗi: {e}')
    
    finally:
        # Đóng cursor và kết nối
        cursor.close()
        db.close()
