// import { Document } from '@llamaindex/core/schema';
// import { SimpleDirectoryReader } from '@llamaindex/readers/directory';
// import {
//   TextFileReader,
//   FileReader,
//   PDFReader,
//   DocxReader,
//   MarkdownReader,
//   HTMLReader,
//   ImageReader,
// } from 'llamaindex';
// import { TSFileReader } from './TSFileReader';
//
// export const FILE_EXT_TO_READER: Record<string, FileReader> = {
//   txt: new TextFileReader(),
//   pdf: new PDFReader(),
//   md: new MarkdownReader(),
//   docx: new DocxReader(),
//   htm: new HTMLReader(),
//   html: new HTMLReader(),
//   jpg: new ImageReader(),
//   jpeg: new ImageReader(),
//   png: new ImageReader(),
//   gif: new ImageReader(),
//   tsx: new TSFileReader(),
//   ts: new TSFileReader(),
// };
//
// /**
//  * Read all the documents in a directory.
//  * By default, supports the list of file types
//  * in the FILE_EXT_TO_READER map.
//  */
// // export class SimpleCodeDirectoryReader extends SimpleDirectoryReader {
// //   async loadData(
// //     params: SimpleDirectoryReaderLoadDataParams
// //   ): Promise<Document[]>;
// //   async loadData(directoryPath: string): Promise<Document[]>;
// //   async loadData(
// //     params: SimpleDirectoryReaderLoadDataParams | string
// //   ): Promise<Document[]> {
// //     if (typeof params === 'string') {
// //       params = { directoryPath: params };
// //     }
// //     params.fileExtToReader = params.fileExtToReader ?? FILE_EXT_TO_READER;
// //     return super.loadData(params);
// //   }
// // }
