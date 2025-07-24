import { Chip } from '@mui/material';
import { useEffect, useState } from 'react';

function parseTagString(str) {
  return str
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function stringifyTags(tags) {
  return tags
    .map((tag) => tag.trim())
    .filter((tag) => tag)
    .join(',');
}

export const TagsStringFilter = ({ filters = {}, updateFilters = () => {} }) => {
  const [tagsArray, setTagsArray] = useState(() => parseTagString(filters.tags || ''));

  const handleAddTag = (newTag) => {
    const cleanedTag = newTag.trim();
    if (!cleanedTag || tagsArray.includes(cleanedTag)) return;

    const updated = [...tagsArray, cleanedTag];
    setTagsArray(updated);
    updateFilters({ tags: stringifyTags(updated) });
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = tagsArray.filter((tag) => tag !== tagToRemove);
    setTagsArray(updated);
    updateFilters({ tags: stringifyTags(updated) });
  };

  useEffect(() => {
    setTagsArray(parseTagString(filters.tags || ''));
  }, [filters.tags]);

  return (
    <div>
      <p className="font-semibold">Tags</p>
      <input
        placeholder="Type, than press Enter"
        type="text"
        className="input"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
      />
      <div className="flex flex-wrap gap-3 pt-2 ">
        {tagsArray.map((tag, index) => (
          <Chip key={index} label={tag} onDelete={() => handleRemoveTag(tag)} />
        ))}
      </div>
      {/* {tagsArray.map((tag) => (
        <span key={tag}>
          {tag}
          <button onClick={() => handleRemoveTag(tag)}>x</button>
        </span>
      ))} */}
    </div>
  );
};
