import pandas as pd
import matplotlib.pyplot as plt

books = pd.read_csv('dataset/books.csv', sep=',', on_bad_lines='skip')

column_to_plot = 'text_reviews_count'
//найти книжку с максмальной кол-во читателй вывести имя и рейтинг
plt.figure(figsize=(12, 6))
books[column_to_plot].hist(bins=20)
plt.title(f'Гистограмма частот для столбца "{column_to_plot}"')
plt.xlabel(column_to_plot)
plt.ylabel('Частота')
plt.show()

median_value = books[column_to_plot].median()
mean_value = books[column_to_plot].mean()
print(f'\nМедиана: {median_value:.2f}')
print(f'Среднее значение: {mean_value:.2f}')

plt.figure(figsize=(10, 6))
books.boxplot(column=column_to_plot)
plt.title(f'Box plot для столбца "{column_to_plot}"')
plt.ylabel(column_to_plot)
plt.show()

description = books[column_to_plot].describe()
print('\nСтатистическое описание параметра:')
print(description)
