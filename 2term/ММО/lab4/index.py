import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, classification_report
from sklearn.metrics import RocCurveDisplay
from sklearn.decomposition import PCA

df = pd.read_csv('dataset/diabetes.csv')
y = df['Outcome']
X = df.drop('Outcome', axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("=" * 50)
print("Logistic Regression Models")
print("=" * 50)

# Default C=1 with L1 regularization
print("\nLogistic Regression with C=1 (default) and L1 regularization:")
model_lr_default = LogisticRegression(penalty='l1', solver='liblinear', random_state=42)
model_lr_default.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_lr_default.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_lr_default.score(X_test_scaled, y_test)))

# C=100
print("\nLogistic Regression with C=100 and L1 regularization:")
model_lr_c100 = LogisticRegression(C=100, penalty='l1', solver='liblinear', random_state=42)
model_lr_c100.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_lr_c100.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_lr_c100.score(X_test_scaled, y_test)))

# C=0.01
print("\nLogistic Regression with C=0.01 and L1 regularization:")
model_lr_c001 = LogisticRegression(C=0.01, penalty='l1', solver='liblinear', random_state=42)
model_lr_c001.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_lr_c001.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_lr_c001.score(X_test_scaled, y_test)))

# L2 regularization with C=0.1
print("\nLogistic Regression with L2 regularization and C=0.1:")
model_lr_l2 = LogisticRegression(penalty='l2', C=0.1, random_state=42)
model_lr_l2.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_lr_l2.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_lr_l2.score(X_test_scaled, y_test)))

best_lr_model = model_lr_l2

print("\nMetrics for the best Logistic Regression model (L2, C=0.1):")
y_pred_lr = best_lr_model.predict(X_test_scaled)
print("Accuracy: {:.2f}".format(accuracy_score(y_test, y_pred_lr)))
print("Precision: {:.2f}".format(precision_score(y_test, y_pred_lr)))
print("Recall: {:.2f}".format(recall_score(y_test, y_pred_lr)))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred_lr))
print("\nClassification Report:")
print(classification_report(y_test, y_pred_lr))

# 2. Support Vector Machine (SVM)
print("\n" + "=" * 50)
print("Support Vector Machine (SVM) Models")
print("=" * 50)

# Default SVM
print("\nDefault SVM:")
model_svc_default = SVC(probability=True, random_state=42)
model_svc_default.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_svc_default.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_svc_default.score(X_test_scaled, y_test)))

# Grid search for best parameters
print("\nPerforming Grid Search for SVM...")
model_SVC = SVC(probability=True, random_state=42)
SVC_params = {"C": [0.1, 1, 10], "gamma": [0.2, 0.6, 1]}
SVC_grid = GridSearchCV(model_SVC, SVC_params, cv=5, n_jobs=-1)
SVC_grid.fit(X_train_scaled, y_train)
print("Best score: {:.2f}".format(SVC_grid.best_score_))
print("Best parameters:", SVC_grid.best_params_)

# Best SVM model from GridSearchCV
best_svc_model = SVC_grid.best_estimator_
print("\nBest SVM model performance:")
print("Правильность на обучающем наборе: {:.2f}".format(best_svc_model.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(best_svc_model.score(X_test_scaled, y_test)))

##############################################

print("\nVisualization of SVM decision boundary and margin...")
# For visualization, we'll use PCA to reduce to 2 dimensions

# Reduce data to 2D for visualization
pca = PCA(n_components=2)
X_train_2d = pca.fit_transform(X_train_scaled)
X_test_2d = pca.transform(X_test_scaled)

# Train a new SVM on the 2D data with the best parameters
best_params = SVC_grid.best_params_
model_svc_2d = SVC(C=best_params['C'], gamma=best_params['gamma'], kernel='rbf', probability=True, random_state=42)
model_svc_2d.fit(X_train_2d, y_train)

# Create a mesh grid for plotting decision boundary
def make_meshgrid(x, y, h=.02):
    x_min, x_max = x.min() - 1, x.max() + 1
    y_min, y_max = y.min() - 1, y.max() + 1
    xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
                         np.arange(y_min, y_max, h))
    return xx, yy

# Plot decision boundary and support vectors
def plot_contours(ax, clf, xx, yy, **params):
    Z = clf.decision_function(np.c_[xx.ravel(), yy.ravel()])
    Z = Z.reshape(xx.shape)
    out = ax.contourf(xx, yy, Z, **params)
    return out

# Set up the figure
fig, ax = plt.subplots(figsize=(12, 9))

# Create mesh grid
X0, X1 = X_train_2d[:, 0], X_train_2d[:, 1]
xx, yy = make_meshgrid(X0, X1)

# Plot decision boundary and margins
plot_contours(ax, model_svc_2d, xx, yy, alpha=0.8, cmap=plt.cm.coolwarm)

# Plot class samples
scatter = ax.scatter(X0, X1, c=y_train, cmap=plt.cm.coolwarm, s=20, edgecolors='k')

# Highlight support vectors with circles
ax.scatter(model_svc_2d.support_vectors_[:, 0], model_svc_2d.support_vectors_[:, 1], 
           s=100, facecolors='none', edgecolors='black', linewidth=1.5)

ax.set_xlabel('PCA Component 1')
ax.set_ylabel('PCA Component 2')
ax.set_title(f'SVM Decision Boundary and Margin (C={best_params["C"]}, gamma={best_params["gamma"]})')
ax.legend(*scatter.legend_elements(), title="Classes")

# Add text explaining support vectors
ax.text(0.02, 0.02, f"Number of support vectors: {model_svc_2d.n_support_.sum()}",
        transform=ax.transAxes, fontsize=10, verticalalignment='bottom',
        bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

plt.savefig('svm_decision_boundary.png')
plt.show()
################################################

print("\nMetrics for the best SVM model:")
y_pred_svc = best_svc_model.predict(X_test_scaled)
print("Accuracy: {:.2f}".format(accuracy_score(y_test, y_pred_svc)))
print("Precision: {:.2f}".format(precision_score(y_test, y_pred_svc)))
print("Recall: {:.2f}".format(recall_score(y_test, y_pred_svc)))
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred_svc))
print("\nClassification Report:")
print(classification_report(y_test, y_pred_svc))

# 3. Decision Tree and K-Nearest Neighbors
print("\n" + "=" * 50)
print("Decision Tree and K-Nearest Neighbors Models")
print("=" * 50)

# Decision Tree
print("\nDecision Tree:")
model_dt = DecisionTreeClassifier(random_state=42)
model_dt.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_dt.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_dt.score(X_test_scaled, y_test)))

# K-Nearest Neighbors
print("\nK-Nearest Neighbors:")
model_knn = KNeighborsClassifier(n_neighbors=5)
model_knn.fit(X_train_scaled, y_train)
print("Правильность на обучающем наборе: {:.2f}".format(model_knn.score(X_train_scaled, y_train)))
print("Правильность на тестовом наборе: {:.2f}".format(model_knn.score(X_test_scaled, y_test)))

# 4. ROC Curves
print("\n" + "=" * 50)
print("ROC Curves Comparison")
print("=" * 50)

plt.figure(figsize=(10, 8))
ax = plt.gca()

# Plot ROC curves for all models
roc_lr = RocCurveDisplay.from_estimator(best_lr_model, X_test_scaled, y_test, name="Logistic Regression", ax=ax)
roc_svc = RocCurveDisplay.from_estimator(best_svc_model, X_test_scaled, y_test, name="SVM", ax=ax)
roc_dt = RocCurveDisplay.from_estimator(model_dt, X_test_scaled, y_test, name="Decision Tree", ax=ax)
roc_knn = RocCurveDisplay.from_estimator(model_knn, X_test_scaled, y_test, name="K-Nearest Neighbors", ax=ax)

plt.title('ROC Curves Comparison')
plt.legend(loc="lower right")
plt.savefig('roc_curves_comparison.png')
plt.show()

print("\nAnalysis completed! ROC curves saved as 'roc_curves_comparison.png'")
print("The model with the largest area under the ROC curve (AUC) performs best.")
