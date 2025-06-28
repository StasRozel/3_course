import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score

sns.set_style('whitegrid')

# Загружаем данные
df = pd.read_csv('dataset/diabetes.csv')
Y = df['Outcome']
X = df.drop('Outcome', axis=1)

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

base_model = DecisionTreeClassifier(random_state=42)
base_model.fit(X_train, Y_train)

Y_pred_base = base_model.predict(X_test)

accuracy_base = accuracy_score(Y_test, Y_pred_base)
conf_matrix_base = confusion_matrix(Y_test, Y_pred_base)
precision_base = precision_score(Y_test, Y_pred_base)
recall_base = recall_score(Y_test, Y_pred_base)

print("Базовая модель:")
print(f"Точность (Accuracy): {accuracy_base:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_base}")
print(f"Precision: {precision_base:.2f}")
print(f"Recall: {recall_base:.2f}")

param_grid = {
    'max_depth': [3, 5, 7, 10, None],
    'max_features': [None, 'sqrt', 'log2']
}

model = DecisionTreeClassifier(random_state=42)

grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1)
grid_search.fit(X_train, Y_train)

best_model = grid_search.best_estimator_
print("\nЛучшие параметры:", grid_search.best_params_)

Y_pred_best = best_model.predict(X_test)

accuracy_best = accuracy_score(Y_test, Y_pred_best)
conf_matrix_best = confusion_matrix(Y_test, Y_pred_best)
precision_best = precision_score(Y_test, Y_pred_best)
recall_best = recall_score(Y_test, Y_pred_best)

print("\nУлучшенная модель:")
print(f"Точность (Accuracy): {accuracy_best:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_best}")
print(f"Precision: {precision_best:.2f}")
print(f"Recall: {recall_best:.2f}")

print("\nСравнение:")
print(f"Точность базовой модели: {accuracy_base:.2f}")
print(f"Точность улучшенной модели: {accuracy_best:.2f}")
print(f"Разница в точности: {(accuracy_best - accuracy_base):.2f}")








fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.suptitle('Матрицы ошибок для Decision Tree', fontsize=16)

sns.heatmap(conf_matrix_base, annot=True, fmt='d', cmap='Blues', ax=axes[0])
axes[0].set_title('Decision Tree (Базовая)')
axes[0].set_xlabel('Предсказанный класс')
axes[0].set_ylabel('Реальный класс')

sns.heatmap(conf_matrix_best, annot=True, fmt='d', cmap='Blues', ax=axes[1])
axes[1].set_title('Decision Tree (Улучшенная)')
axes[1].set_xlabel('Предсказанный класс')
axes[1].set_ylabel('Реальный класс')

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.savefig('img/firstModel/confusion_matrices_dt.png', dpi=300)
print("\nМатрицы ошибок сохранены в 'confusion_matrices_dt.png'")

# 2. Сравнение метрик (Accuracy, Precision, Recall)
metrics = {
    'Decision Tree (Base)': [accuracy_base, precision_base, recall_base],
    'Decision Tree (Best)': [accuracy_best, precision_best, recall_best]
}

metrics_df = pd.DataFrame(metrics, index=['Accuracy', 'Precision', 'Recall']).T

plt.figure(figsize=(8, 6))
metrics_df.plot(kind='bar', figsize=(8, 6))
plt.title('Сравнение метрик для Decision Tree')
plt.ylabel('Значение метрики')
plt.xticks(rotation=45)
plt.legend(loc='best')
plt.tight_layout()
plt.savefig('img/firstModel/metrics_comparison_dt.png', dpi=300)
print("Сравнение метрик сохранено в 'metrics_comparison_dt.png'")

# 3. Визуализация дерева решений (для улучшенной модели)
# Ограничиваем глубину для читаемости
plt.figure(figsize=(20, 10))
plot_tree(best_model, 
          feature_names=X.columns, 
          class_names=['No Diabetes', 'Diabetes'], 
          filled=True, 
          rounded=True, 
          fontsize=12, 
          max_depth=3)  # Ограничение глубины для читаемости
plt.title('Визуализация улучшенного дерева решений (max_depth=3)')
plt.savefig('img/firstModel/decision_tree_visualization.png', dpi=300)
print("Визуализация дерева сохранена в 'decision_tree_visualization.png'")

# Показываем графики (опционально, можно убрать)
plt.show()