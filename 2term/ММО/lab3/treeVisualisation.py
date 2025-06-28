import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

# 1. Загружаем данные
df = pd.read_csv('dataset/diabetes.csv')
Y = df['Outcome']
X = df.drop('Outcome', axis=1)

# 2. Разделяем данные на обучающую и тестовую выборки
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

# 3. Создаем и обучаем модель дерева решений с ограниченной глубиной
# max_depth=3 для читаемости
model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X_train, Y_train)

# 4. Визуализация дерева
plt.figure(figsize=(20,10))  # Устанавливаем размер изображения
plot_tree(model, 
          feature_names=X.columns,  # Названия признаков
          class_names=['No Diabetes', 'Diabetes'],  # Названия классов
          filled=True,  # Цветовая заливка узлов
          rounded=True,  # Закругленные углы
          fontsize=12)  # Размер шрифта

# 5. Сохраняем в файл (например, PNG)
plt.savefig('img/decision_tree.png', dpi=300, bbox_inches='tight')  # Сохраняем в файл
print("Дерево решений сохранено в файл 'decision_tree.png'")

# 6. Показываем график (опционально, можно убрать)
plt.show()

# (Опционально) Оценка точности модели
accuracy = model.score(X_test, Y_test)
print(f"Точность модели с max_depth=3: {accuracy:.2f}")