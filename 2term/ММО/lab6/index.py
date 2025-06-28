import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import KMeans
from sklearn.impute import SimpleImputer
from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.cluster import AgglomerativeClustering
from sklearn.metrics import silhouette_score

# Загрузка датасета
data = pd.read_csv('data.csv')

# Формирование матрицы X
X = data[['child_mort', 'income', 'life_expec', 'gdpp']]

# Проверка на пропуски и обработка
imputer = SimpleImputer(strategy='mean')
X = pd.DataFrame(imputer.fit_transform(X), columns=X.columns)

# Нормализация данных
scaler = MinMaxScaler()
X_scaled = scaler.fit_transform(X)

# Метод локтя для определения количества кластеров
inertia = []
K = range(1, 11)
for k in K:
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertia.append(kmeans.inertia_)

# Визуализация метода локтя
plt.figure(figsize=(8, 6))
plt.plot(K, inertia, 'bx-')
plt.xlabel('Количество кластеров (k)')
plt.ylabel('Инерция')
plt.title('Метод локтя для определения оптимального k')
plt.show()

# Оптимальное k (например, 3, выбираем визуально по "локтю")
optimal_k = 3
kmeans = KMeans(n_clusters=optimal_k, random_state=42)
clusters = kmeans.fit_predict(X_scaled)

# Сортировка меток кластеров по центроидам для согласования
cluster_centers = kmeans.cluster_centers_
sorted_indices = np.argsort(cluster_centers[:, 0])  # Сортировка по первому признаку (child_mort)
clusters_sorted = np.zeros_like(clusters)
for i, idx in enumerate(sorted_indices):
    clusters_sorted[clusters == idx] = i

# Добавление отсортированных меток кластеров к данным
data['cluster'] = clusters_sorted

# Определение фиксированных цветов для кластеров
cluster_colors = {0: '#FFD700', 1: '#00FF00', 2: '#4B0082'}  # 0 — жёлтый, 1 — зелёный, 2 — фиолетовый

# Визуализация результатов K-means (income vs life_expec)
plt.figure(figsize=(8, 6))
scatter = plt.scatter(data['income'], data['life_expec'], c=[cluster_colors[cluster] for cluster in data['cluster']])
handles = [plt.Line2D([0], [0], marker='o', color='w', markerfacecolor=color, markersize=10, label=f'Cluster {i}') for i, color in cluster_colors.items()]
plt.legend(handles=handles, title="Cluster")
plt.xlabel('Income')
plt.ylabel('Life Expectancy')
plt.title('Кластеризация K-means: Income vs Life Expectancy')
plt.show()

# Иерархическая кластеризация и дендрограмма
linked = linkage(X_scaled, method='ward')
plt.figure(figsize=(10, 7))
dendrogram(linked, labels=data['country'].values, orientation='top', distance_sort='descending')
plt.title('Дендрограмма иерархической кластеризации')
plt.xlabel('Страны')
plt.ylabel('Расстояние')
plt.show()

# Оптимальное число кластеров (например, 3, на основе дендрограммы)
optimal_clusters_hier = 3
hierarchical = AgglomerativeClustering(n_clusters=optimal_clusters_hier)
hierarchical_clusters = hierarchical.fit_predict(X_scaled)

# Сортировка меток иерархической кластеризации
hierarchical_centers = np.array([X_scaled[hierarchical_clusters == i].mean(axis=0) for i in range(optimal_clusters_hier)])
sorted_hier_indices = np.argsort(hierarchical_centers[:, 0])  # Сортировка по первому признаку (child_mort)
hierarchical_clusters_sorted = np.zeros_like(hierarchical_clusters)
for i, idx in enumerate(sorted_hier_indices):
    hierarchical_clusters_sorted[hierarchical_clusters == idx] = i

# Диаграмма с кластерами (income vs child_mort) для K-means
plt.figure(figsize=(8, 6))
scatter = plt.scatter(data['income'], data['child_mort'], c=[cluster_colors[cluster] for cluster in data['cluster']])
plt.legend(handles=handles, title="Cluster")
plt.xlabel('Income')
plt.ylabel('Child Mortality')
plt.title('K-means кластеризация: Income vs Child Mortality')
plt.show()

# Диаграмма с кластерами (income vs child_mort) для иерархической кластеризации
plt.figure(figsize=(8, 6))
scatter = plt.scatter(data['income'], data['child_mort'], c=[cluster_colors[cluster] for cluster in hierarchical_clusters_sorted])
plt.legend(handles=handles, title="Cluster")
plt.xlabel('Income')
plt.ylabel('Child Mortality')
plt.title('Иерархическая кластеризация: Income vs Child Mortality')
plt.show()

specific_country = data.iloc[5]['country'] 
specific_index = data.index[data['country'] == specific_country][0]
plt.figure(figsize=(8, 6))
scatter = plt.scatter(data['income'], data['life_expec'], c=[cluster_colors[cluster] for cluster in hierarchical_clusters_sorted], alpha=0.5)
plt.scatter(data.loc[specific_index, 'income'], data.loc[specific_index, 'life_expec'], 
            c='red', s=200, label=f'{specific_country}')
plt.legend(handles=handles + [plt.Line2D([0], [0], marker='o', color='w', markerfacecolor='red', markersize=10, label=specific_country)], title="Cluster")
plt.xlabel('Income')
plt.ylabel('Life Expectancy')
plt.title('Иерархическая кластеризация с выделенной страной: Income vs Life Expectancy')
plt.show()

# Оценка качества кластеризации
kmeans_silhouette = silhouette_score(X_scaled, clusters_sorted)
hierarchical_silhouette = silhouette_score(X_scaled, hierarchical_clusters_sorted)
print(f"Silhouette Score для K-means: {kmeans_silhouette:.4f}")
print(f"Silhouette Score для иерархической кластеризации: {hierarchical_silhouette:.4f}")