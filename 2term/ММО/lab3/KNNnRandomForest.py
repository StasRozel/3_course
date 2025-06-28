import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, accuracy_score, precision_score, recall_score

plt.style.use('ggplot')

df = pd.read_csv('dataset/diabetes.csv')
Y = df['Outcome']
X = df.drop('Outcome', axis=1)

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

print("=== Метод k-ближайших соседей (KNN) ===\n")

knn_base = KNeighborsClassifier()
knn_base.fit(X_train, Y_train)
Y_pred_knn_base = knn_base.predict(X_test)

accuracy_knn_base = accuracy_score(Y_test, Y_pred_knn_base)
conf_matrix_knn_base = confusion_matrix(Y_test, Y_pred_knn_base)
precision_knn_base = precision_score(Y_test, Y_pred_knn_base)
recall_knn_base = recall_score(Y_test, Y_pred_knn_base)

print("Базовая модель KNN:")
print(f"Точность (Accuracy): {accuracy_knn_base:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_knn_base}")
print(f"Precision: {precision_knn_base:.2f}")
print(f"Recall: {recall_knn_base:.2f}")

param_grid_knn = {
    'n_neighbors': [3, 5, 7, 9, 11],
    'weights': ['uniform', 'distance']
}
grid_search_knn = GridSearchCV(KNeighborsClassifier(), param_grid_knn, cv=5, scoring='accuracy', n_jobs=-1)
grid_search_knn.fit(X_train, Y_train)

knn_best = grid_search_knn.best_estimator_
print("\nЛучшие параметры KNN:", grid_search_knn.best_params_)

Y_pred_knn_best = knn_best.predict(X_test)
accuracy_knn_best = accuracy_score(Y_test, Y_pred_knn_best)
conf_matrix_knn_best = confusion_matrix(Y_test, Y_pred_knn_best)
precision_knn_best = precision_score(Y_test, Y_pred_knn_best)
recall_knn_best = recall_score(Y_test, Y_pred_knn_best)

print("\nУлучшенная модель KNN:")
print(f"Точность (Accuracy): {accuracy_knn_best:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_knn_best}")
print(f"Precision: {precision_knn_best:.2f}")
print(f"Recall: {recall_knn_best:.2f}")

print(f"\nСравнение KNN: Разница в точности: {(accuracy_knn_best - accuracy_knn_base):.2f}")

print("\n=== Метод случайного леса (Random Forest) ===\n")

rf_base = RandomForestClassifier(random_state=42)
rf_base.fit(X_train, Y_train)
Y_pred_rf_base = rf_base.predict(X_test)

accuracy_rf_base = accuracy_score(Y_test, Y_pred_rf_base)
conf_matrix_rf_base = confusion_matrix(Y_test, Y_pred_rf_base)
precision_rf_base = precision_score(Y_test, Y_pred_rf_base)
recall_rf_base = recall_score(Y_test, Y_pred_rf_base)

print("Базовая модель Random Forest:")
print(f"Точность (Accuracy): {accuracy_rf_base:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_rf_base}")
print(f"Precision: {precision_rf_base:.2f}")
print(f"Recall: {recall_rf_base:.2f}")

param_grid_rf = {
    'n_estimators': [50, 100, 200],
    'max_depth': [3, 5, 10, None],
    'max_features': ['sqrt', 'log2']
}
grid_search_rf = GridSearchCV(RandomForestClassifier(random_state=42), param_grid_rf, cv=5, scoring='accuracy', n_jobs=-1)
grid_search_rf.fit(X_train, Y_train)


rf_best = grid_search_rf.best_estimator_
print("\nЛучшие параметры Random Forest:", grid_search_rf.best_params_)

Y_pred_rf_best = rf_best.predict(X_test)
accuracy_rf_best = accuracy_score(Y_test, Y_pred_rf_best)
conf_matrix_rf_best = confusion_matrix(Y_test, Y_pred_rf_best)
precision_rf_best = precision_score(Y_test, Y_pred_rf_best)
recall_rf_best = recall_score(Y_test, Y_pred_rf_best)

print("\nУлучшенная модель Random Forest:")
print(f"Точность (Accuracy): {accuracy_rf_best:.2f}")
print(f"Матрица ошибок:\n{conf_matrix_rf_best}")
print(f"Precision: {precision_rf_best:.2f}")
print(f"Recall: {recall_rf_best:.2f}")

print(f"\nСравнение Random Forest: Разница в точности: {(accuracy_rf_best - accuracy_rf_base):.2f}")

# === Визуализация ===

# 1. Визуализация матриц ошибок
fig, axes = plt.subplots(2, 2, figsize=(12, 10))
fig.suptitle('Матрицы ошибок для KNN и Random Forest', fontsize=16)

# KNN базовая
sns.heatmap(conf_matrix_knn_base, annot=True, fmt='d', cmap='Blues', ax=axes[0, 0])
axes[0, 0].set_title('KNN (Базовая)')
axes[0, 0].set_xlabel('Предсказанный класс')
axes[0, 0].set_ylabel('Реальный класс')

# KNN улучшенная
sns.heatmap(conf_matrix_knn_best, annot=True, fmt='d', cmap='Blues', ax=axes[0, 1])
axes[0, 1].set_title('KNN (Улучшенная)')
axes[0, 1].set_xlabel('Предсказанный класс')
axes[0, 1].set_ylabel('Реальный класс')

# Random Forest базовая
sns.heatmap(conf_matrix_rf_base, annot=True, fmt='d', cmap='Greens', ax=axes[1, 0])
axes[1, 0].set_title('Random Forest (Базовая)')
axes[1, 0].set_xlabel('Предсказанный класс')
axes[1, 0].set_ylabel('Реальный класс')

# Random Forest улучшенная
sns.heatmap(conf_matrix_rf_best, annot=True, fmt='d', cmap='Greens', ax=axes[1, 1])
axes[1, 1].set_title('Random Forest (Улучшенная)')
axes[1, 1].set_xlabel('Предсказанный класс')
axes[1, 1].set_ylabel('Реальный класс')

plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.savefig('img/KNNnRF/confusion_matrices.png', dpi=300)
print("\nМатрицы ошибок сохранены в 'confusion_matrices.png'")

# 2. Сравнение метрик (Accuracy, Precision, Recall)
metrics = {
    'KNN (Base)': [accuracy_knn_base, precision_knn_base, recall_knn_base],
    'KNN (Best)': [accuracy_knn_best, precision_knn_best, recall_knn_best],
    'RF (Base)': [accuracy_rf_base, precision_rf_base, recall_rf_base],
    'RF (Best)': [accuracy_rf_best, precision_rf_best, recall_rf_best]
}

metrics_df = pd.DataFrame(metrics, index=['Accuracy', 'Precision', 'Recall']).T

plt.figure(figsize=(10, 6))
metrics_df.plot(kind='bar', figsize=(10, 6))
plt.title('Сравнение метрик для KNN и Random Forest')
plt.ylabel('Значение метрики')
plt.xticks(rotation=45)
plt.legend(loc='best')
plt.tight_layout()
plt.savefig('img/KNNnRF/metrics_comparison.png', dpi=300)
print("Сравнение метрик сохранено в 'metrics_comparison.png'")

# 3. Важность признаков для Random Forest
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': rf_best.feature_importances_
}).sort_values(by='Importance', ascending=False)

plt.figure(figsize=(10, 6))
sns.barplot(x='Importance', y='Feature', data=feature_importance)
plt.title('Важность признаков для Random Forest (Улучшенная модель)')
plt.xlabel('Важность')
plt.ylabel('Признак')
plt.tight_layout()
plt.savefig('img/KNNnRF/feature_importance_rf.png', dpi=300)
print("Важность признаков сохранена в 'feature_importance_rf.png'")

# Показываем графики (опционально, можно убрать)
plt.show()