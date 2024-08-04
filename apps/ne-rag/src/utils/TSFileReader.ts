import { Document } from "@llamaindex/core/schema";
import { FileReader } from 'llamaindex';
import * as ts from 'typescript';
import * as console from 'node:console';


export class TSFileReader extends FileReader {
  async loadDataAsContent(fileContent: Uint8Array): Promise<Document[]> {
    console.log('loadDataAsContent')
    const decoder = new TextDecoder("utf-8");
    const dataBuffer = decoder.decode(fileContent);
    const chunks = this.parseTypeScriptFile(dataBuffer);

    const documents: Document[] = chunks.map(chunk => {
      return  new Document({ text: chunk });
    });
    return documents
  }

  private parseTypeScriptFile(fileContent: string): string[] {
    const sourceFile = ts.createSourceFile('temp.ts', fileContent, ts.ScriptTarget.Latest, true);
    const chunks: string[] = [];

    const visit = (node: ts.Node) => {
      const chunk = node.getText();
      chunks.push(chunk);
      ts.forEachChild(node, visit);
      // if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node) || ts.isMethodDeclaration(node)) {
      //   const chunk = node.getText();
      //   chunks.push(chunk);
      // } else {
      //   ts.forEachChild(node, visit);
      // }
    };

    ts.forEachChild(sourceFile, visit);
    console.log(chunks.length)
    return chunks;
  }
}
