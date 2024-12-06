import { Card, CardContent, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleCard({
  articulo,
  ultimaVersion,
  versiones,
  versionSeleccionada,
  handleChangeVersion,
  handleDeleteVersion,
  handleValoraciones,
  averageRating, // Recibimos averageRating como prop
}) {
  const [iframeUrl, setIframeUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const MAPAS_BASE_API = process.env.NEXT_PUBLIC_VERSION_MAPA_API
    const fetchIframeUrl = async () => {
      if (
        ultimaVersion.coordenadas &&
        Array.isArray(ultimaVersion.coordenadas) &&
        ultimaVersion.coordenadas.length > 0
      ) {
        const coords = ultimaVersion.coordenadas[0];
        if (!isNaN(coords.longitud) && !isNaN(coords.latitud)) {
          setLoading(true);
          try {
            // Llama al backend para obtener la URL del iframe
            const response = await axios.get(`${MAPAS_BASE_API}/${coords.latitud}/${coords.longitud}`);
            setIframeUrl(response.data.iframeUrl); // Guarda la URL recibida del backend
          } catch (error) {
            console.error('Error al obtener la URL del mapa:', error);
          } finally {
            setLoading(false);
          }
        }
      }
    };

    fetchIframeUrl();
  }, [ultimaVersion]);

  console.log(iframeUrl);

  return (
    <Card
      sx={{
        margin: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <CardContent>
        <Typography variant="h3" component="div">
          {articulo.nombre}
        </Typography>
        <FormControl sx={{ margin: 2, minWidth: 200, marginBottom: 2 }}>
          <InputLabel id="version-select-label">Seleccionar Versión</InputLabel>
          <Select
            labelId="version-select-label"
            value={versionSeleccionada._id || ''}
            label="Seleccionar Versión"
            onChange={handleChangeVersion}
          >
            {versiones.map((version, index) => (
              <MenuItem key={version._id} value={version._id}>
                Versión {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="body1">{ultimaVersion.contenido}</Typography>

        {/* Muestra el iframe si la URL está disponible, o un mensaje según el estado */}
        {iframeUrl ? (
          <div style={{ marginTop: '16px' }}>
            <iframe
              width="100%"
              height="300"
              style={{ border: '1px solid black' }}
              loading="lazy"
              src={iframeUrl}
            ></iframe>
          </div>
        ) : loading ? (
          <Typography color="info" variant="body1">
            Cargando mapa...
          </Typography>
        ) : (
          <Typography color="warning" variant="body1">
            Artículo sin coordenadas o no se pudo obtener el mapa.
          </Typography>
        )}

        <Button variant="contained" color="secondary" onClick={handleDeleteVersion} sx={{ marginTop: 2 }}>
          Eliminar Versión
        </Button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
          <Button variant="contained" color="secondary" onClick={handleValoraciones}>
            Valoraciones
          </Button>
          {averageRating && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '16px' }}>
              <span style={{ fontSize: '16px', marginRight: '4px' }}>{averageRating}</span>
              <FaStar color="#FFD700" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
