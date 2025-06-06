package com.obra.pontoeletronico.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.obra.pontoeletronico.adapter.out.persistence.UsuarioRepository;
import com.obra.pontoeletronico.domain.Usuario;
import com.obra.pontoeletronico.dto.LoginDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private static final String EMAIL_TESTE = "teste@exemplo.com";
    private static final String SENHA_TESTE = "senha123";

    @BeforeEach
    void setUp() {
        usuarioRepository.deleteAll();
        
        Usuario usuario = new Usuario();
        usuario.setNome("Usuário Teste");
        usuario.setEmail(EMAIL_TESTE);
        usuario.setSenha(passwordEncoder.encode(SENHA_TESTE));
        usuario.setPerfil(Usuario.Perfil.ADMIN);
        usuario.setAtivo(true);
        
        usuarioRepository.save(usuario);
    }

    @Test
    void login_QuandoCredenciaisValidas_DeveRetornarToken() throws Exception {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(EMAIL_TESTE);
        loginDTO.setSenha(SENHA_TESTE);

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)));

        // Assert
        resultado
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token", notNullValue()))
            .andExpect(jsonPath("$.usuarioId", notNullValue()))
            .andExpect(jsonPath("$.nome", is("Usuário Teste")))
            .andExpect(jsonPath("$.perfil", is("ADMIN")));
    }

    @Test
    void login_QuandoCredenciaisInvalidas_DeveRetornarErro() throws Exception {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(EMAIL_TESTE);
        loginDTO.setSenha("senha-incorreta");

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)));

        // Assert
        resultado
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.mensagem", containsString("Credenciais inválidas")));
    }

    @Test
    void login_QuandoUsuarioInativo_DeveRetornarErro() throws Exception {
        // Arrange
        Usuario usuario = usuarioRepository.findByEmail(EMAIL_TESTE).get();
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(EMAIL_TESTE);
        loginDTO.setSenha(SENHA_TESTE);

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)));

        // Assert
        resultado
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.mensagem", containsString("Usuário inativo")));
    }

    @Test
    void validarToken_QuandoTokenValido_DeveRetornarSucesso() throws Exception {
        // Arrange
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail(EMAIL_TESTE);
        loginDTO.setSenha(SENHA_TESTE);

        String responseJson = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(loginDTO)))
            .andReturn()
            .getResponse()
            .getContentAsString();

        String token = objectMapper.readTree(responseJson).get("token").asText();

        // Act
        ResultActions resultado = mockMvc.perform(post("/api/auth/validar")
            .header("Authorization", "Bearer " + token));

        // Assert
        resultado
            .andExpect(status().isOk())
            .andExpect(content().string("true"));
    }

    @Test
    void validarToken_QuandoTokenInvalido_DeveRetornarFalso() throws Exception {
        // Act
        ResultActions resultado = mockMvc.perform(post("/api/auth/validar")
            .header("Authorization", "Bearer token-invalido"));

        // Assert
        resultado
            .andExpect(status().isOk())
            .andExpect(content().string("false"));
    }
} 