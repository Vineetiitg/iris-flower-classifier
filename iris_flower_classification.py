from pathlib import Path
import json

import pandas as pd
from joblib import dump
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split


ROOT = Path(__file__).resolve().parent
DATA_PATH = ROOT / "data" / "Iris.csv"
OUTPUT_DIR = ROOT / "outputs"
MODEL_DIR = ROOT / "models"


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    data = pd.read_csv(DATA_PATH)
    data = data.drop(columns=["Id"], errors="ignore")

    feature_columns = [
        "SepalLengthCm",
        "SepalWidthCm",
        "PetalLengthCm",
        "PetalWidthCm",
    ]
    X = data[feature_columns]
    y = data["Species"].str.replace("Iris-", "", regex=False)
    return X, y


def train_model() -> dict:
    X, y = load_data()
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        max_depth=4,
    )
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    OUTPUT_DIR.mkdir(exist_ok=True)
    MODEL_DIR.mkdir(exist_ok=True)

    metrics = {
        "accuracy": accuracy_score(y_test, predictions),
        "classification_report": classification_report(
            y_test,
            predictions,
            output_dict=True,
        ),
        "confusion_matrix": confusion_matrix(
            y_test,
            predictions,
            labels=sorted(y.unique()),
        ).tolist(),
        "labels": sorted(y.unique()),
    }

    (OUTPUT_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    dump(model, MODEL_DIR / "iris_classifier.joblib")
    return metrics


if __name__ == "__main__":
    results = train_model()
    print(f"Model accuracy: {results['accuracy']:.3f}")
    print(f"Metrics saved to {OUTPUT_DIR / 'metrics.json'}")
    print(f"Model saved to {MODEL_DIR / 'iris_classifier.joblib'}")
