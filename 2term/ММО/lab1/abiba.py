import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('dataset/books.csv', sep=',', on_bad_lines='skip')

top_10_books = df.nlargest(20, 'text_reviews_count')

plt.figure(figsize=(15, 8))

bars = plt.barh(top_10_books['title'], top_10_books['text_reviews_count'])

plt.title('Топ-10 самых популярных книг по количеству оценок', pad=20)
plt.xlabel('Количество оценок')

plt.gca().xaxis.set_major_formatter(plt.FuncFormatter(lambda x, p: format(int(x), ',')))

plt.gca().invert_yaxis()
plt.tight_layout()

plt.show()

print("\nДетальная информация о топ-10 самых популярных книгах:")
print(top_10_books[['title', 'authors', 'text_reviews_count', 'average_rating']].to_string())