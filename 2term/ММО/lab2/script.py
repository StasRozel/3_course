import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer

data = pd.read_csv('cars.csv')

cols = data.columns[:]

colours = ['#eeeeee', '#00ff00']
sns.heatmap(data[cols].isnull(), cmap=sns.color_palette(colours))
plt.savefig('missing_data_plot.png')



numeric_cols = data.select_dtypes(include='number').columns

plt.figure(figsize=(10, 6))
data[numeric_cols].boxplot()
plt.xticks(rotation=45)
plt.savefig('box_plot.png')
plt.close() 

print(data['hp'].describe())
data = data.fillna(value=None, method="bfill")
categorical_cols = data.select_dtypes(exclude='number').columns
preprocessor = ColumnTransformer(
    transformers=[
        ('encoder', OneHotEncoder(sparse_output=False), categorical_cols),
        ('scaler', StandardScaler(with_mean=False), numeric_cols)
    ],
    remainder='passthrough'
)

X = preprocessor.fit_transform(data)

encoded_names = preprocessor.named_transformers_['encoder'].get_feature_names_out(categorical_cols)
scaled_names = numeric_cols  # уже нормализованные числовые
feature_names = list(encoded_names) + list(scaled_names)

data_normalized_df = pd.DataFrame(X, columns=feature_names)
print(data_normalized_df.head())
data_normalized_df.to_csv('normalized_data.csv', index=False)