import ChatWidget from '../components/ChatWidget';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to MVP Global</h1>
      {/* Page content here */}
      <ChatWidget /> {/* 👈 this shows the widget */}
    </div>
  );
}
