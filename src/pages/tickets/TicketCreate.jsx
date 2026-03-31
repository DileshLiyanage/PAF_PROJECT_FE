import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';   // ← Correct import
import { useNavigate } from 'react-router-dom';

const TicketCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resourceId: '',
    category: '',
    description: '',
    priority: 'MEDIUM',
    contactEmail: '',
    contactPhone: ''
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed!');
      return;
    }
    setImages([...images, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));

    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await axiosInstance.post('/api/tickets', data);

      alert('✅ Ticket created successfully!');
      navigate('/tickets');
    } catch (error) {
      console.error('Ticket creation error:', error);
      alert('Failed to create ticket. Please make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold mb-6">Create New Incident Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1">Category</label>
          <select name="category" value={formData.category} onChange={handleChange} required className="w-full p-3 border rounded">
            <option value="">Select</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="ROOM">Room</option>
            <option value="NETWORK">Network</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full p-3 border rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-3 border rounded">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Resource ID (optional)</label>
            <input name="resourceId" value={formData.resourceId} onChange={handleChange} className="w-full p-3 border rounded" />
          </div>
        </div>

        <div>
          <label className="block mb-1">Evidence Images (max 3)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-3 border rounded" />
          <div className="flex gap-4 mt-4 flex-wrap">
            {previewUrls.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt="preview" className="w-24 h-24 object-cover rounded" />
                <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded font-semibold">
          {loading ? 'Creating Ticket...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketCreate;