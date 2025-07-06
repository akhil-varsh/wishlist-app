import React, { useState } from 'react';
import { BsPlus, BsPencil, BsX } from 'react-icons/bs';

const ManualProductForm = ({ onSubmit, onCancel, initialProduct = null, isEditing = false }) => {
    const [formData, setFormData] = useState({
        title: initialProduct?.title || '',
        price: initialProduct?.price || '',
        image: initialProduct?.image || '',
        description: initialProduct?.description || '',
        category: initialProduct?.category || 'Custom'
    });
    
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(initialProduct?.image || '');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'image' && value) {
            setImagePreview(value);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.title.trim()) newErrors.title = 'Product name is required';
        
        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be a positive number';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            const productData = {
                id: initialProduct?.id || `manual-${Date.now()}`,
                title: formData.title,
                price: parseFloat(formData.price),
                image: formData.image || 'https://via.placeholder.com/150',
                description: formData.description || 'Manually added product',
                category: formData.category || 'Custom'
            };
            
            onSubmit(productData);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">
                    {isEditing ? 'Edit Product' : 'Add Custom Product'}
                </h5>
            </div>
            
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="mb-3">
                                <label htmlFor="productTitle" className="form-label">
                                    Product Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                    id="productTitle"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter product name"
                                    required
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="productPrice" className="form-label">
                                    Price ($) <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                                    id="productPrice"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                />
                                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="productCategory" className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="productCategory"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g., Electronics, Clothing, etc."
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label htmlFor="productDescription" className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    id="productDescription"
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description (optional)"
                                ></textarea>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="mb-3">
                                <label htmlFor="productImage" className="form-label">Image URL</label>
                                <div className="input-group mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productImage"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onClick={() => formData.image && setImagePreview(formData.image)}
                                    >
                                        Test
                                    </button>
                                </div>
                                <small className="form-text text-muted">
                                    Enter a valid image URL or leave blank for a placeholder
                                </small>
                            </div>
                            
                            <div className="text-center mb-3 border p-2" style={{ height: '200px' }}>
                                {imagePreview ? (
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className="img-fluid h-100"
                                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                        onError={() => setImagePreview('https://via.placeholder.com/150?text=Invalid+URL')}
                                    />
                                ) : (
                                    <div className="h-100 d-flex align-items-center justify-content-center text-muted">
                                        <p>Image Preview</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-end mt-3">
                        <button type="button" className="btn btn-outline-secondary me-2" onClick={onCancel}>
                            <BsX className="me-1" /> Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? (
                                <><BsPencil className="me-1" /> Update Product</>
                            ) : (
                                <><BsPlus className="me-1" /> Add Product</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManualProductForm;
