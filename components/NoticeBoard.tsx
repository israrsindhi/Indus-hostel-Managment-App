import React, { useState } from 'react';
import { Notice, User, UserRole } from '../types';

interface NoticeBoardProps {
  notices: Notice[];
  currentUser: User;
  onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  onRemoveNotice: (noticeId: string) => void;
}

const AddNoticeForm: React.FC<{ onAddNotice: (notice: Omit<Notice, 'id' | 'date'>) => void; }> = ({ onAddNotice }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert('Please fill all fields.');
            return;
        }
        onAddNotice({ title, content });
        setTitle('');
        setContent('');
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold text-dark mb-4">Post New Notice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea id="content" value={content} onChange={e => setContent(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                </div>
                <button type="submit" className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors">Post Notice</button>
            </form>
        </div>
    );
};


export const NoticeBoard: React.FC<NoticeBoardProps> = ({ notices, currentUser, onAddNotice, onRemoveNotice }) => {
  return (
    <div className="p-6">
      {currentUser.role === UserRole.ADMIN && <AddNoticeForm onAddNotice={onAddNotice} />}
      <div className="space-y-6">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-primary relative">
             {currentUser.role === UserRole.ADMIN && (
                <button onClick={() => onRemoveNotice(notice.id)} className="absolute top-2 right-2 text-gray-400 hover:text-danger">&times;</button>
             )}
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-dark">{notice.title}</h3>
              <p className="text-sm text-gray-500">{notice.date}</p>
            </div>
            <p className="text-gray-700 mt-2">{notice.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
