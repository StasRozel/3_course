import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import LabelEncoder

# Загрузка датасета
data = pd.read_csv('data.csv')

# Ограничим выбросы в salary_in_usd
data = data[data['salary_in_usd'] <= 500000]

# Преобразование категориальных столбцов в числовой вид
categorical_cols = ['experience_level', 'employment_type', 'work_models', 'company_size']
label_encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col].astype(str))
    label_encoders[col] = le
    # Вывод преобразованных категорий
    print(f"Преобразование столбца {col}:")
    for idx, category in enumerate(le.classes_):
        print(f"  {category} -> {idx}")
    print()

# Определение X и y
X = data[['experience_level', 'work_year', 'employment_type', 'work_models', 'company_size']]
y = data['salary_in_usd']

# Обучение модели
model = LinearRegression()
model.fit(X, y)
y_pred = model.predict(X)

# Добавим предсказания в датасет
data['predicted_salary_in_usd'] = y_pred

# Визуализация: salary_in_usd по experience_level с сеткой
plt.figure(figsize=(10, 6))
plt.scatter(data['experience_level'], data['salary_in_usd'], color='blue', label='Данные', alpha=0.5)
plt.scatter(data['experience_level'], data['predicted_salary_in_usd'], color='red', label='Предсказания', alpha=0.5)
plt.title('Множественная линейная регрессия: Salary in USD vs Experience Level')
plt.xlabel('Experience Level')
plt.ylabel('Salary in USD')
plt.xticks(ticks=[0, 1, 2, 3], labels=['Junior', 'Mid-level', 'Senior', 'Executive'])
plt.grid(True, linestyle='--', alpha=0.7)  # Добавление сетки
plt.legend()
plt.show()

# Оценка модели
r_squared = model.score(X, y)
print(f"R² модели: {r_squared:.4f}")