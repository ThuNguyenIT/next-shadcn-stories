# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup
import re
import time
import mysql.connector
import os
import unidecode
import json
from dotenv import load_dotenv
from pathlib import Path

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

# Hàm chuyển string thành slug
def generate_slug(title):
    # Loại bỏ dấu tiếng Việt và chuyển sang chữ thường
    title = unidecode.unidecode(title.lower())
    # Loại bỏ ký tự đặc biệt và thay thế khoảng trắng bằng dấu gạch ngang
    slug = re.sub(r'[^a-z0-9]+', '-', title).strip('-')
    return slug

# Hàm lấy số trang đầu tiên và số trang cuối cùng
def get_first_and_last_page(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
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

# Hàm lấy danh sách chương từ trang
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

# Hàm lấy nội dung của chương
def get_chapter_content(url):
    time.sleep(0.5)   # Thêm thời gian chờ giữa các yêu cầu
    response = requests.get(url)
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

# Hàm lấy thông tin truyện từ trang
def get_story_info(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Lấy tên
        source_title = soup.find('h3', class_='title', itemprop="name")
        title = source_title.text if source_title else None

        # Lấy slug
        slug = generate_slug(title)

        # Lấy hình ảnh
        image_tag = soup.find('div', class_='books').find('img')
        image_url = image_tag['src'] if image_tag else None

        # Lấy tác giả
        source_author = soup.find('a', itemprop='author')
        author = source_author.text if source_author else None

        # Lấy thể loại
        genres = []
        genre_tags = soup.find('div', class_='info').find_all('a', itemprop='genre')
        for genre in genre_tags:
            genres.append(genre.text)

        # Lấy nguồn
        source_tag = soup.find('span', class_='source')
        source = source_tag.text if source_tag else None

        # Lấy trạng thái
        status_tag = soup.find('span', class_='text-success')
        status = status_tag.text if status_tag else None

        # Lấy mô tả
        description_tag = soup.find('div', class_='desc-text desc-text-full')
        description = description_tag.text if description_tag else None

        return {
            'title': title,
            'slug': slug,
            'author': author,
            'genres': genres,
            'source': source,
            'status': status,
            'image_url': image_url,
            'description': description
        }
    
    return {}

# Hàm lưu dữ liệu truyện vào cơ sở dữ liệu
def save_story_and_chapters(story_info, chapters):
    # Kết nối MySQL
    conn = connect_to_db()
    cursor = conn.cursor()

    # Lấy ID của tác giả
    cursor.execute("SELECT id FROM authors WHERE slug = %s", (generate_slug(story_info['author']),))
    author = cursor.fetchone()

    if author is None:
        cursor.execute("INSERT INTO authors (name, slug) VALUES (%s, %s)", (story_info['author'], generate_slug(story_info['author']),))
        conn.commit()
        author_id = cursor.lastrowid
    else:
        author_id = author[0]

    # Lấy ID của truyện
    cursor.execute("SELECT id FROM stories WHERE slug = %s", (story_info['slug'],))
    story = cursor.fetchone()

    if story is None:
        # Lưu truyện mới
        cursor.execute("""
            INSERT INTO stories (title, slug, description, avatar_image, author_id, status, view_count, total_chapter)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            story_info['title'],
            story_info['slug'],
            story_info['description'],
            json.dumps(story_info['image_url']),
            author_id,
            story_info['status'],
            0,
            story_info['total_chapter']
        ))
        conn.commit()
        story_id = cursor.lastrowid

        if story_info['genre_slugs']:
            # Lấy ID của thể loại
            cursor.execute(f"SELECT id FROM categories WHERE slug IN ({','.join(['%s'] * len(story_info['genre_slugs']))})", story_info['genre_slugs'])
            category_ids = cursor.fetchall()

            if category_ids:
                # Lấy ID của thể loại
                for category_id_tuple in category_ids:
                    category_id = category_id_tuple[0]
                    print(f"category_id: {category_id}")
                    cursor.execute("SELECT category_id FROM story_categories WHERE story_id = %s AND category_id = %s", (story[0], category_id,))
                    story_category = cursor.fetchone()

                    if story_category is None:
                        cursor.execute("""
                            INSERT INTO story_categories (story_id, category_id)
                            VALUES (%s, %s)
                        """, (
                            story[0],
                            category_id
                        ))
                        conn.commit()
    else:
        story_id = story[0]

       # Update truyện với tổng số chương
        cursor.execute("""
            UPDATE stories
            SET total_chapter = %s
            WHERE id = %s
        """, (story_info['total_chapter'], story_id))
        conn.commit()

    # Lưu danh sách chương vào cơ sở dữ liệu
    for chapter in chapters:
        cursor.execute("SELECT id FROM chapters WHERE story_id = %s AND chapter_number = %s", (story_id, chapter['chapter_number']))
        existing_chapter = cursor.fetchone()

        if existing_chapter is None:
            content = get_chapter_content(chapter['url'])
            cursor.execute("""
                INSERT INTO chapters (story_id, title, content, chapter_number)
                VALUES (%s, %s, %s, %s)
            """, (
                story_id,
                chapter['chapter_title'],
                content,
                chapter['chapter_number']
            ))
            conn.commit()

            time.sleep(0.5)   # Thêm thời gian chờ giữa các yêu cầu

    print('Dữ liệu đã được lưu vào cơ sở dữ liệu.')
    cursor.close()
    conn.close()

# Hàm chính để crawl thông tin truyện và danh sách chương
def crawl_story(url):
    # Lấy thông tin truyện
    story_info = get_story_info(url)
    print(f"Truyện: {story_info.get('title')}")
    print(f"Tác giả: {story_info.get('author')}")
    print(f"Thể loại: {', '.join(story_info.get('genres', []))}")
    print(f"Trạng thái: {story_info.get('status')}")
    print(f"Nguồn: {story_info.get('source')}")
    print(f"Hình ảnh: {story_info.get('image_url')}")
    print(f"Mô tả: {story_info.get('description')}")

    # Chuyển thể loại thành slug
    genres = story_info.get('genres')
    slug_genres = [generate_slug(genre) for genre in genres]
    story_info['genre_slugs'] = slug_genres
    
    # Lấy số trang đầu tiên và cuối cùng
    first_page_number, last_page_number = get_first_and_last_page(url)
    print(f"Trang đầu: {first_page_number}")
    print(f"Trang cuối: {last_page_number}")

    all_chapters = []

    # Crawl danh sách chương từ từng trang
    for page in range(first_page_number, (last_page_number+1)):
    # for page in range(first_page_number, 2):
        page_url = f"{url}trang-{page}/"
        print(f"Crawling {page_url}...")
        chapters = get_chapters_from_page(page_url)
        if chapters:
            all_chapters.extend(chapters)

        time.sleep(0.5)   # Thêm thời gian chờ giữa các yêu cầu

    if all_chapters:
        story_info['total_chapter'] = all_chapters[-1]['chapter_number']
    else:
        story_info['total_chapter'] = 0

    # Lưu truyện và danh sách chương
    save_story_and_chapters(story_info, all_chapters)

# URL của trang web cần crawl
url = "https://truyenfull.io/than-dao-dan-ton-6060282/"

# Chạy hàm crawl
crawl_story(url)
