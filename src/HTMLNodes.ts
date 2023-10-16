class HTMLNodes {
  static processInnerText(source: string): string {
    return source.replace(/[\n]/g, '').trim();
  }
}

export default HTMLNodes;
