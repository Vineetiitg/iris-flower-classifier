const SPECIES = {
  "Iris-setosa": "Setosa",
  "Iris-versicolor": "Versicolor",
  "Iris-virginica": "Virginica",
};

const state = {
  train: [],
  test: [],
  labels: [],
  modelReady: false,
};

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const rows = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const [id, sepalLength, sepalWidth, petalLength, petalWidth, species] = line.split(",");
    rows.push({
      id: Number(id),
      features: [Number(sepalLength), Number(sepalWidth), Number(petalLength), Number(petalWidth)],
      species,
    });
  }
  return rows;
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function distance(a, b) {
  return Math.sqrt(a.reduce((sum, value, index) => sum + (value - b[index]) ** 2, 0));
}

function predictKnn(trainSet, features, k = 5) {
  const ranked = trainSet
    .map((row) => ({ species: row.species, dist: distance(row.features, features) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, k);

  const votes = new Map();
  for (const item of ranked) {
    votes.set(item.species, (votes.get(item.species) || 0) + 1);
  }

  let winner = ranked[0]?.species;
  let bestCount = -1;
  for (const [species, count] of votes.entries()) {
    if (count > bestCount) {
      winner = species;
      bestCount = count;
    }
  }

  return { species: winner, neighbors: ranked };
}

function splitData(rows) {
  const shuffled = shuffle(rows);
  const splitIndex = Math.floor(shuffled.length * 0.8);
  return {
    train: shuffled.slice(0, splitIndex),
    test: shuffled.slice(splitIndex),
  };
}

function evaluate(train, test) {
  let correct = 0;
  for (const row of test) {
    const prediction = predictKnn(train, row.features).species;
    if (prediction === row.species) {
      correct += 1;
    }
  }
  return test.length ? correct / test.length : 0;
}

async function loadData() {
  const response = await fetch("data/Iris.csv");
  const text = await response.text();
  const rows = parseCsv(text);
  const { train, test } = splitData(rows);
  state.train = train;
  state.test = test;
  state.labels = [...new Set(rows.map((row) => row.species))];
  state.modelReady = true;
  return rows;
}

function setText(id, text) {
  document.getElementById(id).textContent = text;
}

function renderStats() {
  setText("trainCount", String(state.train.length));
  setText("accuracy", `${(evaluate(state.train, state.test) * 100).toFixed(1)}%`);
}

function renderPrediction(features) {
  if (!state.modelReady) return;
  const result = predictKnn(state.train, features);
  const pretty = SPECIES[result.species] || result.species;
  setText("prediction", pretty);

  const votes = result.neighbors.reduce((map, neighbor) => {
    map.set(neighbor.species, (map.get(neighbor.species) || 0) + 1);
    return map;
  }, new Map());
  const confidence = Math.round((votes.get(result.species) / result.neighbors.length) * 100);
  setText(
    "confidence",
    `Nearest neighbors agree at ${confidence}% confidence. The model predicted ${pretty.toLowerCase()}.`
  );
}

function readFeaturesFromForm() {
  return [
    Number(document.getElementById("sepalLength").value),
    Number(document.getElementById("sepalWidth").value),
    Number(document.getElementById("petalLength").value),
    Number(document.getElementById("petalWidth").value),
  ];
}

document.getElementById("predictForm").addEventListener("submit", (event) => {
  event.preventDefault();
  renderPrediction(readFeaturesFromForm());
});

(async function init() {
  try {
    await loadData();
    renderStats();
    renderPrediction(readFeaturesFromForm());
  } catch (error) {
    setText("prediction", "Could not load dataset");
    setText("confidence", String(error.message || error));
  }
})();
