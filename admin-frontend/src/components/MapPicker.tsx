import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Box, Typography, Alert, TextField, Button, Stack } from '@mui/material';

interface MapPickerProps {
    latitude: number;
    longitude: number;
    onChange: (lat: number, lng: number) => void;
    height?: string;
}

const defaultCenter = {
    lat: -23.550520,
    lng: -46.633308
};

const MapPicker: React.FC<MapPickerProps> = ({ latitude, longitude, onChange, height = '400px' }) => {
    const [error, setError] = useState<string | null>(null);
    const [manualLat, setManualLat] = useState(latitude?.toString() || '');
    const [manualLng, setManualLng] = useState(longitude?.toString() || '');

    const center = latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter;

    const handleClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            onChange(e.latLng.lat(), e.latLng.lng());
            setManualLat(e.latLng.lat().toString());
            setManualLng(e.latLng.lng().toString());
            setError(null);
        }
    };

    const handleManualSubmit = () => {
        const lat = parseFloat(manualLat);
        const lng = parseFloat(manualLng);
        
        if (manualLat === '' && manualLng === '') {
            onChange(0, 0); // Limpa a localização
            setError(null);
            return;
        }

        if (isNaN(lat) || isNaN(lng)) {
            setError('Por favor, insira coordenadas válidas ou deixe ambos os campos vazios');
            return;
        }
        
        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
            setError('Coordenadas fora do intervalo válido');
            return;
        }

        setError(null);
        onChange(lat, lng);
    };

    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    return (
        <Box sx={{ width: '100%' }}>
            {!apiKey && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Chave da API do Google Maps não configurada. Use as coordenadas manualmente.
                </Alert>
            )}

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Box flex={1}>
                    <TextField
                        fullWidth
                        label="Latitude"
                        value={manualLat}
                        onChange={(e) => setManualLat(e.target.value)}
                        error={!!error}
                        helperText={error}
                        placeholder="Opcional"
                    />
                </Box>
                <Box flex={1}>
                    <TextField
                        fullWidth
                        label="Longitude"
                        value={manualLng}
                        onChange={(e) => setManualLng(e.target.value)}
                        error={!!error}
                        placeholder="Opcional"
                    />
                </Box>
                <Button
                    variant="contained"
                    onClick={handleManualSubmit}
                    sx={{ height: '56px', minWidth: '120px' }}
                >
                    {manualLat === '' && manualLng === '' ? 'Limpar' : 'Atualizar'}
                </Button>
            </Stack>

            {apiKey && (
                <Box sx={{ width: '100%' }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                        A localização é opcional. Clique no mapa para selecionar ou use as coordenadas acima.
                    </Alert>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden', height }}>
                        <LoadScript googleMapsApiKey={apiKey}>
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={center}
                                zoom={13}
                                onClick={handleClick}
                            >
                                {latitude && longitude && latitude !== 0 && longitude !== 0 && (
                                    <Marker
                                        position={{ lat: latitude, lng: longitude }}
                                    />
                                )}
                            </GoogleMap>
                        </LoadScript>
                    </Box>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        Clique no mapa para selecionar a localização ou insira as coordenadas manualmente
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default MapPicker; 