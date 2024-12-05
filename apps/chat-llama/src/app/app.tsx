import { Route, Routes } from 'react-router-dom';
import { useChat } from 'ai/react';
// @ts-ignore
import { ChatSection } from '@llamaindex/chat-ui';

export function App() {
  const handler = useChat({
    api: 'http://localhost:3000/api/llamaindex/v1/completions',
    streamProtocol: 'text',
  });
  console.log(handler.messages);

  return (
    <div className="bg-white">
      <section className="mx-auto max-w-[75%] bg-gray-100 p-4">
        <h1 className="text-2xl text-black">Payo chat AI experiments</h1>
        <ChatSection handler={handler} className="border-2" />
      </section>
    </div>
  );
}

export default App;
