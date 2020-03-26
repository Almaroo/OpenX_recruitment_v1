const Node = (params => {
  //WeakMapa na potrzeby hermetyzacji, wzorowane na Mastering JavaScript Object-Oriented Programming, Andrea Chiarelli
  const priv = new WeakMap();
  const _ = instance => priv.get(instance);
  class NodeClass {
    constructor(value, ...nodeChildren) {
      const privateMembers = {};
      privateMembers.value = value;
      privateMembers.parent = null;
      privateMembers.children = nodeChildren.filter(
        x => x instanceof NodeClass
      );
      privateMembers.children.forEach(x => {
        _(x).parent = this;
      });
      priv.set(this, privateMembers);
    }

    getParent() {
      return _(this).parent;
    }

    getChildren() {
      return _(this).children;
    }

    getValue() {
      return _(this).value;
    }
  }
  return NodeClass;
})();

const getSubtreeStatistics = (() => {
  let subset = [];

  const initialize = () => {
    subset = [];
  };

  const sumUpSubtree = node => {
    subset = [...subset, node.getValue()];

    if (node.getChildren().length)
      node.getChildren().forEach(child => {
        return sumUpSubtree(child);
      });
    return subset;
  };

  const calculateMedian = set => {
    if (Array.isArray(set)) {
      let n = Math.floor(set.length / 2);
      if (set.length % 2 === 0) return (set[n] + set[n - 1]) / 2;
      else return set[n];
    }
  };

  const calculateStatistics = node => {
    let sum = 0,
      arithmetic_mean = 0,
      median = 0;

    initialize();
    subset = sumUpSubtree(node);
    subset.sort();
    subset.forEach(x => (sum += x));
    median = calculateMedian(subset);
    return { sum, arithmetic_mean: sum / subset.length, median };
  };

  return calculateStatistics;
})();

const node10 = new Node(5);
const node9 = new Node(8, node10);
const node8 = new Node(2);
const node7 = new Node(0, node8, node9);
const node6 = new Node(1);
const node5 = new Node(5);
const node4 = new Node(2);
const node3 = new Node(7, node6, node7);
const node2 = new Node(3, node4, node5);
const node1 = new Node(5, node2, node3);

console.log(getSubtreeStatistics(node1));
console.log(getSubtreeStatistics(node2));
console.log(getSubtreeStatistics(node3));
console.log(getSubtreeStatistics(node4));
console.log(getSubtreeStatistics(node5));
console.log(getSubtreeStatistics(node6));
console.log(getSubtreeStatistics(node7));
console.log(getSubtreeStatistics(node8));
console.log(getSubtreeStatistics(node9));
console.log(getSubtreeStatistics(node10));
