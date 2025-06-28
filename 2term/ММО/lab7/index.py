import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import time
from sklearn.datasets import load_breast_cancer
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import seaborn as sns

# Настройка стиля графиков
plt.style.use('default')
sns.set_palette("husl")

# 1. Загрузка данных
print("Загрузка датасета breast_cancer...")
X, y = load_breast_cancer(return_X_y=True, as_frame=True)
print(f"Размер датасета: {X.shape}")
print(f"Количество классов: {len(np.unique(y))}")
print(f"Названия признаков (первые 10): {list(X.columns[:10])}")

# Разделение на обучающую и тестовую выборки
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# 2. PCA без нормализации и с нормализацией
print("\n" + "="*60)
print("АНАЛИЗ ВЛИЯНИЯ НОРМАЛИЗАЦИИ НА PCA")
print("="*60)

# PCA без нормализации
pca_without_scaling = PCA()
X_pca_without_scaling = pca_without_scaling.fit_transform(X_train)

# PCA с нормализацией
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
pca_with_scaling = PCA()
X_pca_with_scaling = pca_with_scaling.fit_transform(X_train_scaled)

# 2. Построение гистограммы весов первых компонент
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Анализ весов первых двух главных компонент', fontsize=16, fontweight='bold')

# Веса первой компоненты без нормализации
axes[0, 0].bar(range(len(pca_without_scaling.components_[0])), 
               pca_without_scaling.components_[0])
axes[0, 0].set_title('Первая компонента БЕЗ нормализации')
axes[0, 0].set_xlabel('Индекс признака')
axes[0, 0].set_ylabel('Вес')
axes[0, 0].grid(True, alpha=0.3)

# Веса первой компоненты с нормализацией
axes[0, 1].bar(range(len(pca_with_scaling.components_[0])), 
               pca_with_scaling.components_[0])
axes[0, 1].set_title('Первая компонента С нормализацией')
axes[0, 1].set_xlabel('Индекс признака')
axes[0, 1].set_ylabel('Вес')
axes[0, 1].grid(True, alpha=0.3)

# Веса второй компоненты без нормализации
axes[1, 0].bar(range(len(pca_without_scaling.components_[1])), 
               pca_without_scaling.components_[1])
axes[1, 0].set_title('Вторая компонента БЕЗ нормализации')
axes[1, 0].set_xlabel('Индекс признака')
axes[1, 0].set_ylabel('Вес')
axes[1, 0].grid(True, alpha=0.3)

# Веса второй компоненты с нормализацией
axes[1, 1].bar(range(len(pca_with_scaling.components_[1])), 
               pca_with_scaling.components_[1])
axes[1, 1].set_title('Вторая компонента С нормализацией')
axes[1, 1].set_xlabel('Индекс признака')
axes[1, 1].set_ylabel('Вес')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Анализ дисперсии, объясняемой первыми компонентами
print(f"\nДисперсия, объясняемая первыми двумя компонентами:")
print(f"БЕЗ нормализации: {pca_without_scaling.explained_variance_ratio_[:2]}")
print(f"С нормализацией: {pca_with_scaling.explained_variance_ratio_[:2]}")
print(f"Общая дисперсия первых двух компонент БЕЗ нормализации: {pca_without_scaling.explained_variance_ratio_[:2].sum():.3f}")
print(f"Общая дисперсия первых двух компонент С нормализацией: {pca_with_scaling.explained_variance_ratio_[:2].sum():.3f}")

# 3. Визуализация распределения классов в 2D пространстве PCA
fig, axes = plt.subplots(1, 2, figsize=(15, 6))
fig.suptitle('Визуализация классов в пространстве первых двух главных компонент', 
             fontsize=14, fontweight='bold')

# Без нормализации
scatter1 = axes[0].scatter(X_pca_without_scaling[:, 0], X_pca_without_scaling[:, 1], 
                          c=y_train, cmap='viridis', alpha=0.7)
axes[0].set_title('БЕЗ нормализации')
axes[0].set_xlabel(f'PC1 ({pca_without_scaling.explained_variance_ratio_[0]:.2%} дисперсии)')
axes[0].set_ylabel(f'PC2 ({pca_without_scaling.explained_variance_ratio_[1]:.2%} дисперсии)')
axes[0].grid(True, alpha=0.3)
plt.colorbar(scatter1, ax=axes[0])

# С нормализацией
scatter2 = axes[1].scatter(X_pca_with_scaling[:, 0], X_pca_with_scaling[:, 1], 
                          c=y_train, cmap='viridis', alpha=0.7)
axes[1].set_title('С нормализацией')
axes[1].set_xlabel(f'PC1 ({pca_with_scaling.explained_variance_ratio_[0]:.2%} дисперсии)')
axes[1].set_ylabel(f'PC2 ({pca_with_scaling.explained_variance_ratio_[1]:.2%} дисперсии)')
axes[1].grid(True, alpha=0.3)
plt.colorbar(scatter2, ax=axes[1])

plt.tight_layout()
plt.show()

# 4. Обучение SVM без PCA
print("\n" + "="*60)
print("ОБУЧЕНИЕ SVM БЕЗ PCA")
print("="*60)

start_time = time.time()
svm_original = SVC(kernel='rbf', random_state=42)
svm_original.fit(X_train, y_train)
training_time_original = time.time() - start_time

y_pred_original = svm_original.predict(X_test)
accuracy_original = accuracy_score(y_test, y_pred_original)

print(f"Точность SVM без PCA: {accuracy_original:.4f}")
print(f"Время обучения SVM без PCA: {training_time_original:.4f} секунд")

# 5. Определение оптимального количества компонент для сохранения 90% дисперсии
print("\n" + "="*60)
print("ОПРЕДЕЛЕНИЕ КОЛИЧЕСТВА КОМПОНЕНТ ДЛЯ 90% ДИСПЕРСИИ")
print("="*60)

# График кумулятивной дисперсии
cumulative_variance_ratio = np.cumsum(pca_with_scaling.explained_variance_ratio_)
n_components_90 = np.argmax(cumulative_variance_ratio >= 0.9) + 1

plt.figure(figsize=(12, 8))
plt.subplot(2, 1, 1)
plt.plot(range(1, len(cumulative_variance_ratio) + 1), cumulative_variance_ratio, 'bo-', linewidth=2)
plt.axhline(y=0.9, color='r', linestyle='--', linewidth=2, label='90% дисперсии')
plt.axvline(x=n_components_90, color='r', linestyle='--', linewidth=2, 
            label=f'{n_components_90} компонент')
plt.xlabel('Количество компонент')
plt.ylabel('Кумулятивная дисперсия')
plt.title('Кумулятивная дисперсия от количества главных компонент')
plt.grid(True, alpha=0.3)
plt.legend()

plt.subplot(2, 1, 2)
plt.plot(range(1, min(21, len(pca_with_scaling.explained_variance_ratio_) + 1)), 
         pca_with_scaling.explained_variance_ratio_[:20], 'go-', linewidth=2)
plt.xlabel('Номер компоненты')
plt.ylabel('Доля дисперсии')
plt.title('Дисперсия каждой компоненты (первые 20)')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print(f"Для сохранения 90% дисперсии требуется {n_components_90} компонент")
print(f"Это составляет {n_components_90/X_train.shape[1]*100:.1f}% от исходного количества признаков")

# 6. Обучение SVM с PCA
print("\n" + "="*60)
print("ОБУЧЕНИЕ SVM С PCA")
print("="*60)

# PCA с оптимальным количеством компонент
pca_optimal = PCA(n_components=n_components_90)
X_train_pca = pca_optimal.fit_transform(X_train_scaled)
X_test_scaled = scaler.transform(X_test)
X_test_pca = pca_optimal.transform(X_test_scaled)

start_time = time.time()
svm_pca = SVC(kernel='rbf', random_state=42)
svm_pca.fit(X_train_pca, y_train)
training_time_pca = time.time() - start_time

y_pred_pca = svm_pca.predict(X_test_pca)
accuracy_pca = accuracy_score(y_test, y_pred_pca)

print(f"Точность SVM с PCA ({n_components_90} компонент): {accuracy_pca:.4f}")
print(f"Время обучения SVM с PCA: {training_time_pca:.4f} секунд")

# Сравнительная таблица результатов
print("\n" + "="*60)
print("СРАВНИТЕЛЬНАЯ ТАБЛИЦА РЕЗУЛЬТАТОВ")
print("="*60)

results_df = pd.DataFrame({
    'Метод': ['SVM без PCA', 'SVM с PCA'],
    'Количество признаков': [X_train.shape[1], n_components_90],
    'Точность': [f"{accuracy_original:.4f}", f"{accuracy_pca:.4f}"],
    'Время обучения (сек)': [f"{training_time_original:.4f}", f"{training_time_pca:.4f}"],
    'Ускорение': [1.0, training_time_original/training_time_pca]
})

print(results_df.to_string(index=False))

# Дополнительная визуализация: сравнение результатов
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

# График точности
methods = ['SVM без PCA', 'SVM с PCA']
accuracies = [accuracy_original, accuracy_pca]
bars1 = axes[0].bar(methods, accuracies, color=['skyblue', 'lightcoral'], alpha=0.8)
axes[0].set_ylabel('Точность')
axes[0].set_title('Сравнение точности моделей')
axes[0].set_ylim([min(accuracies) - 0.01, max(accuracies) + 0.01])
axes[0].grid(True, alpha=0.3)
for bar, acc in zip(bars1, accuracies):
    axes[0].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.001, 
                f'{acc:.4f}', ha='center', va='bottom', fontweight='bold')

# График времени обучения
times = [training_time_original, training_time_pca]
bars2 = axes[1].bar(methods, times, color=['skyblue', 'lightcoral'], alpha=0.8)
axes[1].set_ylabel('Время обучения (секунды)')
axes[1].set_title('Сравнение времени обучения')
axes[1].grid(True, alpha=0.3)
for bar, time_val in zip(bars2, times):
    axes[1].text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(times)*0.01, 
                f'{time_val:.4f}', ha='center', va='bottom', fontweight='bold')

# График количества признаков
features = [X_train.shape[1], n_components_90]
bars3 = axes[2].bar(methods, features, color=['skyblue', 'lightcoral'], alpha=0.8)
axes[2].set_ylabel('Количество признаков')
axes[2].set_title('Сравнение размерности данных')
axes[2].grid(True, alpha=0.3)
for bar, feat in zip(bars3, features):
    axes[2].text(bar.get_x() + bar.get_width()/2, bar.get_height() + max(features)*0.01, 
                f'{feat}', ha='center', va='bottom', fontweight='bold')

plt.tight_layout()
plt.show()

print("\n" + "="*60)
print("ВЫВОДЫ")
print("="*60)
print(f"1. Нормализация данных критически важна для PCA:")
print(f"   - Без нормализации первые компоненты доминируют из-за различий в масштабах")
print(f"   - С нормализацией компоненты более равномерно распределены")
print(f"")
print(f"2. PCA позволяет значительно сократить размерность:")
print(f"   - С {X_train.shape[1]} до {n_components_90} признаков ({n_components_90/X_train.shape[1]*100:.1f}%)")
print(f"   - При сохранении 90% дисперсии данных")
print(f"")
print(f"3. Влияние на производительность SVM:")
print(f"   - Точность: {accuracy_original:.4f} → {accuracy_pca:.4f} ({'+' if accuracy_pca > accuracy_original else ''}{(accuracy_pca-accuracy_original)*100:.2f}%)")
print(f"   - Время обучения: {training_time_original:.4f}с → {training_time_pca:.4f}с (ускорение в {training_time_original/training_time_pca:.1f}x)")
print(f"")
if accuracy_pca >= accuracy_original * 0.98:  # Если потери точности менее 2%
    print(f"4. Заключение: PCA эффективно снижает размерность с минимальными потерями точности")
else:
    print(f"4. Заключение: PCA существенно ускоряет обучение, но приводит к заметному снижению точности")