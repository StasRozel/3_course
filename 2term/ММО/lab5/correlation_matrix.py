import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.preprocessing import LabelEncoder

# Загрузка датасета
data = pd.read_csv('data.csv')

# Преобразование категориальных столбцов в числовой вид
categorical_cols = ['job_title', 'experience_level', 'employment_type', 'work_models', 
                    'employee_residence', 'salary_currency', 'company_location', 'company_size']

# Применяем LabelEncoder для каждого категориального столбца
label_encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col].astype(str))
    label_encoders[col] = le

# Проверяем, что все столбцы теперь числовые
print("Типы данных после преобразования:")
print(data.dtypes)

# Шаг 1: Матрица корреляций
plt.figure(figsize=(10, 8))
correlation_matrix = data.corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', vmin=-1, vmax=1, center=0)
plt.title('Correlation Matrix Heatmap (All Columns)')
plt.show()