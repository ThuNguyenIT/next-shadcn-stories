# -*- coding: utf-8 -*-
import requests
import os
import json
import logging
from dotenv import load_dotenv
from pathlib import Path
from bs4 import BeautifulSoup
import mysql.connector
import gspread
from gspread.exceptions import APIError

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

# Hàm thực hiện crawl và thêm vào bảng "lists"
def crawl_and_add_to_list(soup, cursor, db):
    # Tìm ul chứa danh sách các phần tử
    ul_container = soup.find('ul', class_='control nav navbar-nav')

    if ul_container:
        # Lấy danh sách các li trong ul_container
        li_elements = ul_container.find_all('li', class_='dropdown')

        # Xử lý "Danh sách" từ li vị trí 0 > ul
        if li_elements[0]:
            list_ul = li_elements[0].find('ul', class_='dropdown-menu')

            if list_ul:
                list_items = list_ul.find_all('li')
                lists = []

                for item in list_items:
                    item_name = item.get_text().strip()  # Lấy tên của danh sách
                    item_link = item.find('a')['href']   # Lấy link của danh sách
                    lists.append({ 'title': item_name, 'url': item_link })

                    # Loại bỏ tiền tố 'https://truyenfull.io/danh-sach/' để lấy phần sau
                    cleaned_item_link = item_link.replace('https://truyenfull.io/danh-sach/', '').strip('/')

                    # Kiểm tra nếu mục đã tồn tại trong bảng lists
                    cursor.execute("SELECT * FROM lists WHERE name=%s AND slug=%s", (item_name, cleaned_item_link))
                    result = cursor.fetchone()

                    if result:
                        print(f'Mục "{item_name}" đã tồn tại trong bảng lists.')
                    else:
                        # Chèn mục mới vào bảng lists nếu chưa tồn tại
                        cursor.execute("INSERT INTO lists (name, slug) VALUES (%s, %s)", (item_name, cleaned_item_link))
                        db.commit()
                        print(f'Thêm mục "{item_name}" vào bảng lists với slug: {cleaned_item_link}')
                    
                return lists
            else:
                print('Không tìm thấy ul trong Danh sách.')
        else:
            print('Không tìm thấy li trong Danh sách.')

# Hàm thực hiện crawl và thêm vào bảng "categories"
def crawl_and_add_to_category(soup, cursor, db):
    # Tìm ul chứa danh sách các phần tử
    ul_container = soup.find('ul', class_='control nav navbar-nav')

    if ul_container:
        # Lấy danh sách các li trong ul_container
        li_elements = ul_container.find_all('li', class_='dropdown')

        if li_elements[1]:
            list_ul = li_elements[1].find_all('ul', class_='dropdown-menu')

            if list_ul:
                categories = []

                for ul in list_ul:
                    list_items = ul.find_all('li')
                    for item in list_items:
                        item_name = item.get_text().strip()  # Lấy tên của thể loại
                        item_link = item.find('a')['href']   # Lấy link của thể loại
                        categories.append({ 'title': item_name, 'url': item_link })

                        # Loại bỏ tiền tố 'https://truyenfull.io/the-loai/' để lấy phần sau
                        cleaned_item_link = item_link.replace('https://truyenfull.io/the-loai/', '').strip('/')

                        # Kiểm tra nếu mục đã tồn tại trong bảng categories
                        cursor.execute("SELECT * FROM categories WHERE name=%s AND slug=%s", (item_name, cleaned_item_link))
                        result = cursor.fetchone()

                        if result:
                            print(f'Mục "{item_name}" đã tồn tại trong bảng categories.')
                        else:
                            # Chèn mục mới vào bảng categories nếu chưa tồn tại
                            cursor.execute("INSERT INTO categories (name, slug) VALUES (%s, %s)", (item_name, cleaned_item_link))
                            db.commit()
                            print(f'Thêm mục "{item_name}" vào bảng categories với slug: {cleaned_item_link}')

                return categories
            else:
                print('Không tìm thấy ul trong Thể loại.')
        else:
            print('Không tìm thấy li trong Thể loại.')

# Hàm để lưu trữ dữ liệu lên Google Sheet bằng credentials.json
def save_to_google_sheet(sheet_id, sheet_name, categories):
    # Khởi tạo client gspread từ credentials.json
    try:
        gc = gspread.service_account(filename='app/crawl/credentials.json')

        # Mở Google Sheet bằng ID
        sheet = gc.open_by_key(sheet_id).worksheet(sheet_name)

        # Xóa dữ liệu cũ trên Google Sheet (nếu cần)
        sheet.clear()

        # Ghi dữ liệu mới lên Google Sheet
        header = ['Title', 'URL']
        sheet.append_row(header)

        for category in categories:
            row = [category['title'], category['url']]
            sheet.append_row(row)

        print(f'Dữ liệu đã được lưu lên Google Sheet trong sheet: {sheet_name}')
    except APIError as e:
        print(f'Lỗi khi lưu dữ liệu lên Google Sheet: {str(e)}')
        print(traceback.format_exc())
    except Exception as e:
        print(f'Có lỗi xảy ra: {str(e)}')
        print(traceback.format_exc())

# Hàm chính để khởi chạy crawl và xuất dữ liệu ra file JSON
def main():
    # Kết nối đến MySQL
    db = connect_to_db()
    cursor = db.cursor()

    # URL của trang bạn muốn crawl
    url = 'https://truyenfull.io/'

    try:
        # Gửi yêu cầu HTTP tới trang web
        response = requests.get(url)
        response.raise_for_status()  # Kiểm tra nếu yêu cầu thành công (mã 200)

        # Parse HTML bằng BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Crawl và thêm vào bảng lists
        lists = crawl_and_add_to_list(soup, cursor, db)
        
        # Lưu dữ liệu lists lên Google Sheet
        save_to_google_sheet("1x0fes9vsalXRqAQgfsys6ZHwMBGlrPHfOG4xn2TK-Hk", "List", lists)

        # Crawl và thêm vào bảng categories
        categories = crawl_and_add_to_category(soup, cursor, db)

        # Lưu dữ liệu categories lên Google Sheet
        save_to_google_sheet("1x0fes9vsalXRqAQgfsys6ZHwMBGlrPHfOG4xn2TK-Hk", "Category", categories)

        # Xuất lists và categories ra file JSON
        data = {
            "lists": lists,
            "categories": categories
        }

        with open('app/crawl/truyenfull.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print('Dữ liệu đã được lưu vào file truyenfull.json')

    except requests.exceptions.RequestException as e:
        print(f'Yêu cầu gặp lỗi: {e}')
    
    finally:
        # Đóng cursor và kết nối
        cursor.close()
        db.close()

# Chạy chương trình chính
if __name__ == '__main__':
    main()
