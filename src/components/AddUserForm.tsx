import { useState } from 'react';
import type { UserInfo } from '../hooks/useUserList.ts';

interface AddUserFormProps {
  onSubmit: (user: UserInfo) => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<Omit<UserInfo, 'avatar'>>({
    name: '',
    intro: '',
  });

  const [errors, setErrors] = useState<{ name?: string; intro?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors: { name?: string; intro?: string } = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.intro.trim()) {
      newErrors.intro = 'Introduction is required';
    }
    return newErrors;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const newUser: UserInfo = {
      id: Date.now(),
      name: formData.name.trim(),
      intro: formData.intro.trim(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`, // 使用随机头像
    };
    onSubmit(newUser);
    setFormData({ name: '', intro: '' });
  };
  return (
    <form onSubmit={handleSubmit} className="add-user-form">
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
        </label>
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>
      <div>
        <label>
          Introduction:
          <textarea
            name="intro"
            value={formData.intro}
            onChange={handleChange}
            className={errors.intro ? 'input-error' : ''}
          />
        </label>
        {errors.intro && <span className="error-text">{errors.intro}</span>}
      </div>
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
