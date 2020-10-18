class Domain {
  constructor(boundary) {
    this.set = new Set();
    [...Array(boundary).keys()].forEach((y) =>
      [...Array(boundary).keys()].forEach((x) => {
        this.set.add(this.hash([y, x]));
      })
    );
    this.maxValue = boundary;
    this.maxSquared = boundary ** 2;
  }

  hash([y, x]) {
    if (y < 0 || x < 0) return -1;
    if (y > this.maxValue - 1 || x > this.maxValue - 1) return -1;
    return (y * 10 + x) | 0;
  }

  revHash(index) {
    return [(index / this.maxValue) | 0, index % this.maxValue];
  }

  edgeHash(i0, i1) {
    return Math.min(i1 * this.maxSquared + i0, i0 * this.maxSquared + i1) | 0;
  }

  revEdgeHash(index) {
    return [(index / this.maxSquared) | 0, index % this.maxSquared];
  }
}

const EPSILON = 0.001;

const createDiscreteRandom = (dist) => {
  const s = dist.reduce((sum, p) => sum + p, 0);
  if (Math.abs(1 - s) > EPSILON) {
    console.debug(s);
    throw new Error("Probability mass function doesn't sum to one.");
  }
  const nonZeroIndices = dist
    .map((p, index) => (p > 0 ? index : -1))
    .filter((index) => index > -1);
  const nonZeroDist = nonZeroIndices.map((index) => dist[index]);
  const cumulitiveSum = new Array(nonZeroDist.length).fill(0);
  let acc = 0;
  nonZeroDist.forEach((p, index) => {
    acc += p;
    cumulitiveSum[index] = acc;
  });
  return () => {
    const rnd = Math.random();
    const nonZeroIndex = cumulitiveSum.findIndex((value) => rnd - value <= 0);
    return nonZeroIndex === -1
      ? nonZeroIndices.slice(-1)
      : nonZeroIndices[nonZeroIndex];
  };
};

class GraphEntity {
  constructor(domain, pattern) {
    this.vertices = new Map();
    this.edges = new Set();
    this.adjList = new Map();
    this.domain = domain;
    this.pattern = pattern;
  }

  addVertex(index, label = -1) {
    if (this.vertices.has(index)) return;
    this.vertices.set(index, label);
    this.addToAdj(index);
  }

  addToAdj(index0, index1 = null) {
    let list = [];
    if (this.adjList.has(index0)) {
      list = this.adjList.get(index0);
    }
    if (index1 !== null) {
      list.push(index1);
    }
    this.adjList.set(index0, list);
  }

  addEdge(index0, index1) {
    const index = this.domain.edgeHash(index0, index1);
    if (this.edges.has(index)) return;
    this.edges.add(index, true);
    this.addToAdj(index0, index1);
    this.addToAdj(index1, index0);
  }

  getNeighborList(vertex) {
    const list = [];
    this.pattern.forEach(([dy, dx]) => {
      let [y, x] = this.domain.revHash(vertex);
      y += dy;
      x += dx;
      const neighborIndex = this.domain.hash([y, x]);
      if (!this.domain.set.has(neighborIndex)) return; //Cell is outside of the domain
      if (this.vertices.has(neighborIndex)) list.push(neighborIndex);
    });
    return list;
  }

  getDomainList() {
    const list = [];
    this.domain.set.forEach((index) => {
      list.push(index);
    });
    return list;
  }

  getVertexList() {
    const list = [];
    this.vertices.forEach((_, index) => {
      list.push(index);
    });
    return list;
  }

  getEdgeList() {
    const list = [];
    this.edges.forEach((index) => {
      const [v0, v1] = this.domain.revEdgeHash(index);
      list.push([this.domain.revHash(v0), this.domain.revHash(v1)]);
    });
    return list;
  }

  getComponents() {
    const components = [];
    const visited = new Set();

    const search = (neighbors, component) => {
      neighbors.forEach((vertex) => {
        if (visited.has(vertex)) return;
        visited.add(vertex);
        component.push(vertex);
        search(this.adjList.get(vertex), component);
      });
    };

    this.adjList.forEach((list, vertex) => {
      if (visited.has(vertex)) return;
      if (list.length === 0) {
        visited.add(vertex);
        components.push([vertex]);
      } else {
        const component = [vertex];
        components.push(component);
        visited.add(vertex);
        search(list, component);
      }
    });
    return components;
  }

  construct(dist) {
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    const distRnd = createDiscreteRandom(dist);

    this.domain.set.forEach((index) => {
      const degree = distRnd();
      this.addVertex(index, degree);
    });

    const allEdgesSet = new Set();

    this.vertices.forEach((_, index) => {
      const neighbors = this.getNeighborList(index);
      neighbors.forEach((neighborIndex) =>
        allEdgesSet.add(this.domain.edgeHash(index, neighborIndex))
      );
    });

    const allEdges = [...allEdgesSet.keys()];
    shuffle(allEdges);

    const hasCapacity = (index) =>
      this.adjList.get(index).length < this.vertices.get(index);

    allEdges.forEach((edgeIndex) => {
      const [i0, i1] = this.domain.revEdgeHash(edgeIndex);
      if (hasCapacity(i0) && hasCapacity(i1)) {
        this.addEdge(i0, i1);
      }
    });
  }
}

export { Domain, GraphEntity };
