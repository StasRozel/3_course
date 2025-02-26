import numpy as np
import pandas as pd

random_array = np.random.randint(0, 100, (4, 5))

print("Исходный массив:")
print(random_array)

half_1 = random_array[:2, :]
half_2 = random_array[2:, :]

print("\nПервый массив (2 строки):")
print(half_1)

print("\nВторой массив (2 строки):")
print(half_2)

target_value = 30 #int(input("Введите число, которое нужно найти: "))

indices = np.where(half_1 == target_value)

print(f"Количество элементов, равных {target_value}, в первом массиве: {len(half_1[indices])}")

np_array = np.array([1, 4, 9, 16, 25])
series = pd.Series(np_array)

print("Объект Series:")
print(series)

print("\nСложение:")
print(series + 2)

print("\nВычитание:")
print(series - 3)

print("\nУмножение:")
print(series * 2)

print("\nДеление:")
print(series / 4)

print("\nВозведение в степень:")
print(series ** 2)

print("\nПрименение встроенных функций NumPy:")
print(np.sqrt(series))
print(np.log(series))

np_array3d = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])

# Создаем DataFrame из массива NumPy
df = pd.DataFrame(np_array3d)

print("Объект DataFrame:")
print(df)

df = pd.DataFrame(np_array3d, columns=['A', 'B', 'C'], index=['X', 'Y', 'Z'])

print("Объект DataFrame:")
print(df)

# Устанавливаем новые названия колонок
df.columns = ['Alpha', 'Beta', 'Gamma']
print("\nDataFrame с новыми названиями колонок:")
print(df)

# Удаляем строку 'Y'
df = df.drop('Y')
print("\nDataFrame после удаления строки 'Y':")
print(df)

# Удаляем столбец 'Beta'
df = df.drop('Beta', axis=1)
print("\nDataFrame после удаления столбца 'Beta':")
print(df)

# Выводим размер получившегося DataFrame
print(f"\nРазмер DataFrame: {df.shape}")

# Находим все элементы, равные 3
print("\nЭлементы, равные 3:")
print(df[df == 3])


