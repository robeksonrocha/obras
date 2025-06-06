package com.obra.pontoeletronico.service;

import com.obra.pontoeletronico.adapter.out.persistence.UsuarioRepository;
import com.obra.pontoeletronico.domain.Usuario;
import com.obra.pontoeletronico.dto.LoginDTO;
import com.obra.pontoeletronico.dto.TokenDTO;
import com.obra.pontoeletronico.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(authenticationManager, jwtTokenProvider, usuarioRepository, passwordEncoder, jwtService);
    }

    @Test
    void autenticarComSucesso() {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("teste@teste.com");
        loginDTO.setSenha("123456");

        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setEmail("teste@teste.com");
        usuario.setNome("Teste");
        usuario.setPerfil(Usuario.Perfil.ADMIN);
        usuario.setAtivo(true);
        usuario.setSenha("$2a$10$XXXXXXXXXXXXXXXXXXXXXXXX"); // Senha hasheada

        when(usuarioRepository.findByEmail(loginDTO.getEmail())).thenReturn(Optional.of(usuario));
        when(jwtService.generateToken(usuario)).thenReturn("token");
        when(passwordEncoder.matches(loginDTO.getSenha(), usuario.getPassword())).thenReturn(true);

        // Act
        TokenDTO resultado = authService.autenticar(loginDTO);

        // Assert
        assertNotNull(resultado);
        assertEquals("token", resultado.getToken());
        assertEquals(1L, resultado.getId());
        assertEquals("Teste", resultado.getNome());
        assertEquals(Usuario.Perfil.ADMIN, resultado.getPerfil());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_QuandoCredenciaisInvalidas_DeveLancarExcecao() {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("usuario@teste.com");
        loginDTO.setSenha("senha-incorreta");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenThrow(new RuntimeException("Credenciais inválidas"));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.login(loginDTO);
        });

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(usuarioRepository, never()).findByEmail(any());
        verify(jwtTokenProvider, never()).generateToken(any());
    }

    @Test
    void login_QuandoUsuarioNaoEncontrado_DeveLancarExcecao() {
        // Arrange
        String email = "naoexiste@teste.com";
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(email);
        loginDTO.setSenha("senha123");

        Authentication authentication = mock(Authentication.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
            .thenReturn(authentication);
        when(usuarioRepository.findByEmail(email))
            .thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            authService.login(loginDTO);
        });

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(usuarioRepository).findByEmail(email);
        verify(jwtTokenProvider, never()).generateToken(any());
    }

    @Test
    void validarToken_QuandoTokenValido_DeveRetornarTrue() {
        // Arrange
        String token = "token-valido";
        when(jwtTokenProvider.validateToken(token)).thenReturn(true);

        // Act
        boolean resultado = authService.validarToken(token);

        // Assert
        assertTrue(resultado);
        verify(jwtTokenProvider).validateToken(token);
    }

    @Test
    void validarToken_QuandoTokenInvalido_DeveRetornarFalse() {
        // Arrange
        String token = "token-invalido";
        when(jwtTokenProvider.validateToken(token)).thenReturn(false);

        // Act
        boolean resultado = authService.validarToken(token);

        // Assert
        assertFalse(resultado);
        verify(jwtTokenProvider).validateToken(token);
    }
} 