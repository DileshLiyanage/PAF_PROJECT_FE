package com.paf.project.service;

import com.paf.project.dto.TicketRequest;
import com.paf.project.model.Ticket;
import com.paf.project.model.TicketStatus;
import com.paf.project.model.User;
import com.paf.project.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public Ticket createTicket(TicketRequest request, User currentUser) {
        Ticket ticket = Ticket.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TicketStatus.OPEN)
                .createdBy(currentUser)
                .build();
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsForUser(User currentUser) {
        return ticketRepository.findByCreatedBy(currentUser);
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public Ticket updateTicket(Long id, TicketRequest request, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ticket not found with id: " + id));

        if (!ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to update this ticket");
        }

        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id, User currentUser) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ticket not found with id: " + id));

        if (!ticket.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this ticket");
        }

        ticketRepository.deleteById(id);
    }
}
