import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const CATEGORY_TREE = {
  RESOURCE: {
    PROJECTOR: ['P0001', 'P0002', 'P0003'],
    CAMERA: ['C0001', 'C0002', 'C0003'],
    WHITEBOARD: ['WB001', 'WB002', 'WB003']
  },
  LOCATION: {
    LECTURE_HALL: ['A0401', 'B0502', 'C0301'],
    LAB: ['LAB201', 'LAB305', 'LAB402'],
    MEETING_ROOM: ['MR101', 'MR204', 'MR307']
  }
};

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
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subCategoryItem, setSubCategoryItem] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const subCategoryOptions = useMemo(() => {
    if (!mainCategory) return [];
    return Object.keys(CATEGORY_TREE[mainCategory] || {});
  }, [mainCategory]);

  const itemOptions = useMemo(() => {
    if (!mainCategory || !subCategory) return [];
    return CATEGORY_TREE[mainCategory]?.[subCategory] || [];
  }, [mainCategory, subCategory]);

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainCategoryChange = (e) => {
    const nextMain = e.target.value;
    setMainCategory(nextMain);
    setSubCategory('');
    setSubCategoryItem('');
    setFormData((prev) => ({ ...prev, category: '', resourceId: '' }));
  };

  const handleSubCategoryChange = (e) => {
    const nextSub = e.target.value;
    setSubCategory(nextSub);
    setSubCategoryItem('');
    setFormData((prev) => ({
      ...prev,
      category: nextSub ? `${mainCategory}_${nextSub}` : '',
      resourceId: ''
    }));
  };

  const handleSubCategoryItemChange = (e) => {
    const nextItem = e.target.value;
    setSubCategoryItem(nextItem);
    setFormData((prev) => ({ ...prev, resourceId: nextItem }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert('Maximum 3 images allowed!');
      return;
    }
    setImages((prev) => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainCategory || !subCategory || !subCategoryItem) {
      alert('Please select category, subcategory, and subcategory item.');
      return;
    }

    if (!formData.contactEmail && !formData.contactPhone) {
      alert('Please provide at least one preferred contact detail (email or phone).');
      return;
    }

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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(125deg, rgba(9, 20, 41, 0.76), rgba(33, 87, 141, 0.58)), url('https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1800&q=80')"
      }}
    >
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-white/30 bg-white/10 p-6 shadow-2xl backdrop-blur-2xl md:p-8">
          <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">Create New Incident Ticket</h1>
          <p className="mb-8 text-sm text-slate-100/90">Report resource or location issues with evidence and your preferred contact details.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Main Category</label>
                <select
                  value={mainCategory}
                  onChange={handleMainCategoryChange}
                  required
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white outline-none placeholder:text-white/70 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                >
                  <option value="" className="text-slate-900">Select main category</option>
                  <option value="RESOURCE" className="text-slate-900">Resource</option>
                  <option value="LOCATION" className="text-slate-900">Location</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Subcategory</label>
                <select
                  value={subCategory}
                  onChange={handleSubCategoryChange}
                  required
                  disabled={!mainCategory}
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="" className="text-slate-900">Select subcategory</option>
                  {subCategoryOptions.map((option) => (
                    <option key={option} value={option} className="text-slate-900">
                      {option.replaceAll('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Item / Code</label>
                <select
                  value={subCategoryItem}
                  onChange={handleSubCategoryItemChange}
                  required
                  disabled={!subCategory}
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="" className="text-slate-900">Select item code</option>
                  {itemOptions.map((option) => (
                    <option key={option} value={option} className="text-slate-900">{option}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the issue clearly..."
                className="w-full rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white outline-none"
                >
                  <option value="LOW" className="text-slate-900">Low</option>
                  <option value="MEDIUM" className="text-slate-900">Medium</option>
                  <option value="HIGH" className="text-slate-900">High</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Preferred Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="example@sliit.lk"
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white placeholder:text-white/70 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Preferred Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="07X XXX XXXX"
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white placeholder:text-white/70 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Evidence Images (max 3)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-600"
              />

              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {previewUrls.map((url, i) => (
                    <div key={url} className="group relative overflow-hidden rounded-xl border border-white/40">
                      <img src={url} alt="preview" className="h-28 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white opacity-90"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-white/30 bg-white/10 p-3 text-xs text-slate-100">
              Category will be sent as: <span className="font-semibold">{formData.category || 'Not selected'}</span>
              <br />
              Resource/Location code will be sent as: <span className="font-semibold">{formData.resourceId || 'Not selected'}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-base font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating Ticket...' : 'Submit Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketCreate;