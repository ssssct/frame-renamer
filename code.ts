figma.showUI(__html__);

function sortByPosition(a: FrameNode, b: FrameNode) {
  return a.y - b.y || a.x - b.x;
}

figma.ui.onmessage = (msg: { type: string; prefix: string; start: number }) => {
  if (msg.type === 'rename-frames') {
    const nodes = figma.currentPage.selection;

    const frames = [];

    for (const node of nodes) {
      if (node.type === 'FRAME' && 'name' in node) {
        frames.push(node);
      }
    }

    if (frames.length) {
      const sortedFrames = frames.sort(sortByPosition);

      let count: number = msg.start || 1;
      for (const frame of sortedFrames) {
        frame.name = msg.prefix + count.toString();
        count++;
      }

      figma.notify('${count} frames renamed!');

      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
    } else {
      figma.notify('Please select some frames !');
    }
  }

  figma.closePlugin();
};
