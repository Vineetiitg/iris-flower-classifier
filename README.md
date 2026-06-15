# Iris Flower Classification

This project trains a machine learning model to classify iris flowers as setosa, versicolor, or virginica from sepal and petal measurements.

## Dataset

The dataset is included at `data/Iris.csv` and contains 150 labeled iris flower observations.

## How to Run

```bash
pip install -r requirements.txt
python iris_flower_classification.py
```

The script writes:

- `outputs/metrics.json` for model accuracy, class metrics, and confusion matrix
- `models/iris_classifier.joblib` for the trained model

## Approach

The model uses a random forest classifier with a stratified train/test split so all three flower classes are represented in the test set.
