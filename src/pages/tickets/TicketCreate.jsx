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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+94|0)\d{9}$/;

const formatLabel = (value) =>
  value
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const InFlowGlassDropdown = ({
  value,
  placeholder,
  options,
  onSelect,
  disabled = false,
  formatOption,
  onBlur,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
    if (onBlur) onBlur();
  };

  const handleBlur = () => {
    if (onBlur) onBlur();
  };

  return (
    <div className="w-full">
      <button
        type="button"
        name={name}
        onClick={handleToggle}
        onBlur={handleBlur}
        disabled={disabled}
        className="flex w-full items-center justify-between rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-left text-sm text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-md transition hover:bg-white/25 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span>{value ? (formatOption ? formatOption(value) : value) : placeholder}</span>
        <svg
          className={`h-4 w-4 text-white/90 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="mt-2 overflow-hidden rounded-xl border border-white/35 bg-white/15 shadow-[0_8px_24px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-white/80">No options available</p>
          ) : (
            options.map((option) => (
              <button
                key={option}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(option)}
                className="block w-full border-b border-white/10 px-3 py-2 text-left text-sm text-white transition last:border-b-0 hover:bg-white/20"
              >
                {formatOption ? formatOption(option) : option}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
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
  const [submitError, setSubmitError] = useState('');
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

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
    const nextState = { ...formData, [e.target.name]: e.target.value };
    setFormData(nextState);
    setErrors(validateForm(nextState, mainCategory, subCategory, subCategoryItem, images));
  };

  const markTouched = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = (state, main, sub, item, selectedImages) => {
    const nextErrors = {};

    if (!main) nextErrors.mainCategory = 'Main category is required.';
    if (!sub) nextErrors.subCategory = 'Subcategory is required.';
    if (!item) nextErrors.subCategoryItem = 'Item code is required.';
    if (!state.description.trim()) {
      nextErrors.description = 'Description is required.';
    } else if (state.description.trim().length < 10) {
      nextErrors.description = 'Description should be at least 10 characters.';
    }

    if (!state.priority) nextErrors.priority = 'Priority is required.';

    if (!state.contactEmail.trim() && !state.contactPhone.trim()) {
      nextErrors.contactDetails = 'Provide at least one preferred contact detail.';
    }

    if (state.contactEmail.trim() && !EMAIL_REGEX.test(state.contactEmail.trim())) {
      nextErrors.contactEmail = 'Enter a valid email address.';
    }

    if (state.contactPhone.trim()) {
      const normalizedPhone = state.contactPhone.replace(/\s+/g, '');
      if (!PHONE_REGEX.test(normalizedPhone)) {
        nextErrors.contactPhone = 'Use a valid Sri Lankan number (07XXXXXXXX or +947XXXXXXXX).';
      }
    }

    if (selectedImages.length > 3) {
      nextErrors.images = 'Maximum 3 images allowed.';
    }

    return nextErrors;
  };

  const handleMainCategoryChange = (nextMain) => {
    setMainCategory(nextMain);
    setSubCategory('');
    setSubCategoryItem('');
    setFormData((prev) => ({ ...prev, category: '', resourceId: '' }));
    setTouched((prev) => ({ ...prev, mainCategory: true, subCategory: false, subCategoryItem: false }));
    setErrors(validateForm(formData, nextMain, '', '', images));
  };

  const handleSubCategoryChange = (nextSub) => {
    setSubCategory(nextSub);
    setSubCategoryItem('');
    const nextState = {
      ...formData,
      category: nextSub ? `${mainCategory}_${nextSub}` : '',
      resourceId: ''
    };
    setFormData(nextState);
    setTouched((prev) => ({ ...prev, subCategory: true, subCategoryItem: false }));
    setErrors(validateForm(nextState, mainCategory, nextSub, '', images));
  };

  const handleSubCategoryItemChange = (nextItem) => {
    setSubCategoryItem(nextItem);
    const nextState = { ...formData, resourceId: nextItem };
    setFormData(nextState);
    setTouched((prev) => ({ ...prev, subCategoryItem: true }));
    setErrors(validateForm(nextState, mainCategory, subCategory, nextItem, images));
  };

  const handlePriorityChange = (nextPriority) => {
    const nextState = { ...formData, priority: nextPriority };
    setFormData(nextState);
    setTouched((prev) => ({ ...prev, priority: true }));
    setErrors(validateForm(nextState, mainCategory, subCategory, subCategoryItem, images));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      setTouched((prev) => ({ ...prev, images: true }));
      setErrors((prev) => ({ ...prev, images: 'Maximum 3 images allowed.' }));
      return;
    }

    const hasInvalidFile = files.some((file) => !file.type.startsWith('image/'));
    if (hasInvalidFile) {
      setTouched((prev) => ({ ...prev, images: true }));
      setErrors((prev) => ({ ...prev, images: 'Only image files are allowed.' }));
      return;
    }

    const nextImages = [...images, ...files];
    setImages(nextImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    setTouched((prev) => ({ ...prev, images: true }));
    setErrors(validateForm(formData, mainCategory, subCategory, subCategoryItem, nextImages));
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    const nextImages = images.filter((_, i) => i !== index);
    setImages(nextImages);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setTouched((prev) => ({ ...prev, images: true }));
    setErrors(validateForm(formData, mainCategory, subCategory, subCategoryItem, nextImages));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateForm(formData, mainCategory, subCategory, subCategoryItem, images);
    setErrors(validationErrors);
    setTouched({
      mainCategory: true,
      subCategory: true,
      subCategoryItem: true,
      description: true,
      priority: true,
      contactEmail: true,
      contactPhone: true,
      images: true
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    images.forEach((image) => {
      data.append('images', image);
    });

    try {
      await axiosInstance.post('/api/tickets', data);
      navigate('/tickets');
    } catch (error) {
      console.error('Ticket creation error:', error);
      setSubmitError('Failed to create ticket. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const showError = (key) => touched[key] && errors[key];

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

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Main Category</label>
                <InFlowGlassDropdown
                  name="mainCategory"
                  value={mainCategory}
                  onSelect={handleMainCategoryChange}
                  onBlur={() => markTouched('mainCategory')}
                  placeholder="Select main category"
                  options={['RESOURCE', 'LOCATION']}
                  formatOption={(option) => formatLabel(option)}
                >
                </InFlowGlassDropdown>
                {showError('mainCategory') && <p className="mt-1 text-xs text-red-200">{errors.mainCategory}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Subcategory</label>
                <InFlowGlassDropdown
                  name="subCategory"
                  value={subCategory}
                  onSelect={handleSubCategoryChange}
                  onBlur={() => markTouched('subCategory')}
                  placeholder="Select subcategory"
                  options={subCategoryOptions}
                  formatOption={formatLabel}
                  disabled={!mainCategory}
                />
                {showError('subCategory') && <p className="mt-1 text-xs text-red-200">{errors.subCategory}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Item Code</label>
                <InFlowGlassDropdown
                  name="itemCode"
                  value={subCategoryItem}
                  onSelect={handleSubCategoryItemChange}
                  onBlur={() => markTouched('subCategoryItem')}
                  placeholder="Select item code"
                  options={itemOptions}
                  disabled={!subCategory}
                />
                {showError('subCategoryItem') && <p className="mt-1 text-xs text-red-200">{errors.subCategoryItem}</p>}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={() => markTouched('description')}
                required
                rows="5"
                placeholder="Describe the issue clearly..."
                className="w-full resize-none rounded-xl border border-white/40 bg-white/20 px-4 py-3 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur-md focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
              />
              {showError('description') && <p className="mt-1 text-xs text-red-200">{errors.description}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Priority</label>
                <InFlowGlassDropdown
                  name="priority"
                  value={formData.priority}
                  onSelect={handlePriorityChange}
                  onBlur={() => markTouched('priority')}
                  placeholder="Select priority"
                  options={['LOW', 'MEDIUM', 'HIGH']}
                  formatOption={formatLabel}
                />
                {showError('priority') && <p className="mt-1 text-xs text-red-200">{errors.priority}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Preferred Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  onBlur={() => markTouched('contactEmail')}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur-md focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                />
                {showError('contactEmail') && <p className="mt-1 text-xs text-red-200">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-white">Preferred Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  onBlur={() => markTouched('contactPhone')}
                  placeholder="07X XXX XXXX"
                  className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white placeholder:text-white/70 outline-none backdrop-blur-md focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200"
                />
                {showError('contactPhone') && <p className="mt-1 text-xs text-red-200">{errors.contactPhone}</p>}
              </div>
            </div>

            {(touched.contactEmail || touched.contactPhone) && errors.contactDetails && (
              <p className="-mt-2 text-xs text-red-200">{errors.contactDetails}</p>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-white">Evidence Images (max 3)</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                onBlur={() => markTouched('images')}
                className="w-full rounded-xl border border-white/40 bg-white/20 px-3 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-cyan-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-cyan-600"
              />
              {showError('images') && <p className="mt-1 text-xs text-red-200">{errors.images}</p>}

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

            {submitError && (
              <div className="rounded-xl border border-red-300/40 bg-red-500/15 p-3 text-sm text-red-100">
                {submitError}
              </div>
            )}

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