import React, { useState } from 'react';
import './SideBar.css';
import { useCart } from '../../../cart/CartProvider';

function SideBar() {
  const { items, total, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const validatePhone = (phone) => {
    const phoneRegex = /^(\+251|0)?9\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const orderedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    count: item.quantity,
    subtotal: item.price * item.quantity,
  }));


  const isFormValid = () => {
    return items.length > 0 &&
      formData.name.trim() !== '' &&
      validatePhone(formData.phone) &&
      formData.area.trim() !== '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    if (items.length === 0) {
      newErrors.orders = 'Please add items to your order';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid TeleBirr number. Use format: 0912345678 or +251912345678';
    }

    if (!formData.area.trim()) {
      newErrors.area = 'Area is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Order submitted:', { ...formData, items });
    setSubmitted(true);
    dispatch({ type: 'clear' });

    setTimeout(() => {
      setFormData({ name: '', phone: '', area: '' });
      setErrors({});
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <section className='side'>
        <div className="sidebar-content">
          <div className="success-message-box">
            <h3>✓ Order Confirmed!</h3>
            <p>Your order will be delivered to {formData.area}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='side'>
      <div className="sidebar-content">
        <h2>Order Summary</h2>

        {orderedItems.length === 0 ? (
          <div className="empty-order">
            <p>No items added yet</p>
          </div>
        ) : (
          <>
            <div className="order-items">
              {orderedItems.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p className="item-price">{item.price} ETB × {item.count}</p>
                  </div>
                  <div className="item-actions">
                    <div className="item-subtotal">
                      {item.subtotal} ETB
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => dispatch({ type: 'remove', dishId: item.id })}
                      title="Remove this item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-divider"></div>

            <div className="order-total">
              <span>Total</span>
              <span className="total-amount">{total} ETB</span>
            </div>
          </>
        )}

        {orderedItems.length > 0 && (
          <>
            <div className="form-divider"></div>
            <h3>Delivery Information</h3>

            <form onSubmit={handleSubmit} className="order-form">
              {errors.orders && <div className="form-error">{errors.orders}</div>}

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={errors.name ? 'input-error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">TeleBirr Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912345678"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
                {!errors.phone && formData.phone && validatePhone(formData.phone) && (
                  <span className="success-message">✓ Valid</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="area">Delivery Area *</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="e.g., Bole"
                  className={errors.area ? 'input-error' : ''}
                />
                {errors.area && <span className="error-message">{errors.area}</span>}
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid()}
              >
                {isFormValid() ? 'Place Order' : 'Complete Form'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}

export default SideBar;
