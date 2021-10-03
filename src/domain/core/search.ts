import {Node} from './node';

export const searchBFS = (
  from: Node,
  searchPredicate: (node: Node) => boolean
): boolean => {
  const queue: Node[] = [from];
  const visited = new Set<Node>();
  while (queue.length !== 0) {
    const currentNode = queue.shift()!;
    if (searchPredicate(currentNode)) {
      return true;
    }
    currentNode.connectedNodes
      .filter(n => !visited.has(n))
      .forEach(n => {
        visited.add(n);
        queue.push(n);
      });
  }
  return false;
};
