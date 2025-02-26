import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('dataset/books.csv', sep=',', on_bad_lines='skip')

column_to_plot = 'ratings_count'

# Построение гистограммы
plt.figure(figsize=(12, 6))
df[column_to_plot].hist(bins=20)
plt.title(f'Гистограмма частот для столбца "{column_to_plot}"')
plt.xlabel(column_to_plot)
plt.ylabel('Частота')
plt.show()