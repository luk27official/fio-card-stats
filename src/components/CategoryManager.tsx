import { useState } from "react";
import "./CategoryManager.css";
import { Category, generateCategoryColor } from "../utils/customTypes";

interface CategoryManagerProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
  onClose: () => void;
}

function CategoryManager({ categories, onUpdate, onClose }: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryPrettyName, setNewCategoryPrettyName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(generateCategoryColor());

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }

    // Check if category with this name already exists
    if (categories.some((c) => c.name === newCategoryName.trim())) {
      alert("Category with this name already exists");
      return;
    }

    const newCategory: Category = {
      id: newCategoryName.trim().toLowerCase().replace(/\s+/g, "_"),
      name: newCategoryName.trim(),
      prettyName: newCategoryPrettyName.trim() || newCategoryName.trim(),
      color: newCategoryColor,
    };

    onUpdate([...categories, newCategory]);

    // Reset form
    setNewCategoryName("");
    setNewCategoryPrettyName("");
    setNewCategoryColor(generateCategoryColor());
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (categories.length <= 1) {
      alert("You must have at least one category");
      return;
    }

    if (
      confirm(
        `Are you sure you want to remove the category "${categories.find((c) => c.id === categoryId)?.prettyName}"?`
      )
    ) {
      onUpdate(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleColorChange = (categoryId: string, color: string) => {
    onUpdate(categories.map((c) => (c.id === categoryId ? { ...c, color } : c)));
  };

  const handlePrettyNameChange = (categoryId: string, prettyName: string) => {
    onUpdate(categories.map((c) => (c.id === categoryId ? { ...c, prettyName } : c)));
  };

  return (
    <div className="category-manager-overlay">
      <div className="category-manager">
        <div className="category-manager-header">
          <h2>Manage Categories</h2>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="category-manager-content">
          <div className="categories-list">
            <h3>Current Categories</h3>
            {categories.map((category) => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <input
                    type="color"
                    value={category.color}
                    onChange={(e) => handleColorChange(category.id, e.target.value)}
                    className="color-picker"
                    title="Category color"
                  />
                  <input
                    type="text"
                    value={category.prettyName}
                    onChange={(e) => handlePrettyNameChange(category.id, e.target.value)}
                    className="pretty-name-input"
                    title="Display name"
                  />
                  <span className="category-id">({category.name})</span>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveCategory(category.id)}
                  title="Remove category"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="add-category-form">
            <h3>Add New Category</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Category name (e.g., shopping)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <input
                type="text"
                placeholder="Display name (e.g., Shopping)"
                value={newCategoryPrettyName}
                onChange={(e) => setNewCategoryPrettyName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label>Color:</label>
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="color-picker"
              />
              <button onClick={() => setNewCategoryColor(generateCategoryColor())} className="generate-color-button">
                Random
              </button>
            </div>
            <button onClick={handleAddCategory} className="add-button">
              Add Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryManager;
