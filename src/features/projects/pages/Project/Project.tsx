import { useState } from 'react';
import { useGetPostsQuery, useDeletePostMutation } from '../../../../redux/api';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';
import ProjectTemplate from '../../../projects/templates/ProjectTemplate/ProjectTemplate';

const Project = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { isLoading, data, refetch } = useGetPostsQuery();
  const navigate = useNavigate();
  const [deletePost] = useDeletePostMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddClick = () => navigate('/add-project');
  const handleEditClick = (id: number) => {
    navigate(`/add-project?id=${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const filteredData: Post[] =
    data?.filter((project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className={`page ${theme}`}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProjectTemplate
          title={t('project')}
          onAddClick={handleAddClick}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onSearchClick={() => setSearchQuery(searchTerm)}
          onClearClick={() => {
            setSearchTerm('');
            setSearchQuery('');
          }}
          // projects={filteredData}
          projects={filteredData.map((p) => ({
            ...p,
            id: Number(p.id), // ✅ Convert id to number
          }))}
          onEdit={handleEditClick}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Project;
