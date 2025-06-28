import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

# Загрузка датасета
data = pd.read_csv('data.csv')

# Ограничим выбросы в salary и salary_in_usd (например, до 500,000)
data = data[(data['salary'] <= 500000) & (data['salary_in_usd'] <= 500000)]

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

# Добавим кодирование для employment_type и work_models, если ещё не преобразованы
for col in ['employment_type', 'work_models']:
    if col not in label_encoders:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col].astype(str))
        label_encoders[col] = le
        # Вывод преобразованных категорий
        print(f"Преобразование столбца {col}:")
        for idx, category in enumerate(le.classes_):
            print(f"  {category} -> {idx}")
        print()

# Выбор новых столбцов для матрицы диаграмм
selected_cols = ['work_year', 'salary', 'employment_type', 'work_models']

# Построение матрицы диаграмм (pairplot) без лишнего plt.figure()
sns.pairplot(data[selected_cols])
plt.suptitle('Updated Pairplot: Work Year, Salary, Employment Type, Work Models', y=1.02)
plt.show()