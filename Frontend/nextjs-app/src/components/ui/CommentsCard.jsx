import { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';
import axios from "axios";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default function CommentsCard({ articleId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_VERSION_BASE_API}/comentario/${articleId}`);
        if (res.status === 200) {
          setComments(res.data);
        }
      } catch (error) {
        console.error('Error al obtener comentarios:', error.message);
      }
    };

    fetchComments();
  }, [articleId]);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const submitComment = async () => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_VERSION_BASE_API}/comentario/${articleId}`, { comentario: newComment });
      if (res.status === 200) {
        setComments([...comments, res.data]); // Agrega el nuevo comentario a la lista
        setNewComment(''); // Limpia el campo de texto
      }
    } catch (error) {
      console.error('Error al enviar comentario:', error.message);
    }
  };

  return (
    <div style={{ margin: '20px', width: '100%' }}>
      <h3>Comentarios</h3>
      {comments.map((comment, index) => (
        <div key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
          {/* Mostrar el autor y la fecha */}
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {comment.autor} - {formatDistanceToNow(new Date(comment.fecha), { addSuffix: true, locale: es })}
          </div>
          {/* Mostrar el comentario */}
          <div>{comment.comentario}</div>
        </div>
      ))}
      <TextField
        label="Nuevo Comentario"
        variant="outlined"
        fullWidth
        value={newComment}
        onChange={handleCommentChange}
        style={{ marginTop: '10px' }}
      />
      <Button onClick={submitComment} variant="contained" color="primary" style={{ marginTop: '10px' }}>
        Enviar Comentario
      </Button>
    </div>
  );
}