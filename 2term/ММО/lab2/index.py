import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

data = pd.read_csv('cars.csv')    

print(data.isnull().sum())

cols = data.columns[:]

colours = ['#eeeeee', '#00ff00']
sns.heatmap(data[cols].isnull(), cmap=sns.color_palette(colours))
plt.savefig('missing_data_plot.png')

numeric_cols = data.select_dtypes(include='number').columns

data['hp'].boxplot()
plt.savefig('box_plot.png')

data = data.fillna(value=None, method="bfill")

print(data.isnull().sum())


