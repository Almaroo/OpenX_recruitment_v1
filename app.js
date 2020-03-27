const Node = (params => {
  //WeakMapa na potrzeby hermetyzacji, wzorowane na Mastering JavaScript Object-Oriented Programming, Andrea Chiarelli
  const priv = new WeakMap();
  const _ = instance => priv.get(instance);
  class NodeClass {
    constructor(value, ...nodeChildren) {
      const privateMembers = {};
      privateMembers.value = Math.round(value) || 0;
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

  const calculateStatistics = (node, test) => {
    let sum = 0,
      arithmetic_mean = 0,
      median = 0;

    if (test) return { calculateMedian, subset, initialize, sumUpSubtree };
    if (node) {
      initialize();
      subset = sumUpSubtree(node);
      subset.sort();
      subset.forEach(x => (sum += x));
      median = calculateMedian(subset);
      return { sum, arithmetic_mean: sum / subset.length, median };
    } else return { sum, arithmetic_mean, median };
  };

  return calculateStatistics;
})();

module.exports = { Node, getSubtreeStatistics };
