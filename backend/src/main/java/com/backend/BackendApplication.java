package com.backend;

import com.backend.entities.Client;
import com.backend.entities.Commande;
import com.backend.repositories.ClientRepository;
import com.backend.repositories.CommandeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.UUID;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(ClientRepository clientRepository, CommandeRepository commandeRepository) {
		return args -> {

			commandeRepository.deleteAll();
			clientRepository.deleteAll();

			System.out.println("Données existantes supprimées.");


			Client client1 = new Client();
			client1.setTrackingId(UUID.randomUUID());
			client1.setFullname("Jean Dupont");
			clientRepository.save(client1);

			Client client2 = new Client();
			client2.setTrackingId(UUID.randomUUID());
			client2.setFullname("Marie Martin");
			clientRepository.save(client2);

			Client client3 = new Client();
			client3.setTrackingId(UUID.randomUUID());
			client3.setFullname("Pierre Durand");
			clientRepository.save(client3);


			Commande commande1 = new Commande();
			commande1.setTrackingId(UUID.randomUUID());
			commande1.setNumeroCommande(1001);
			commande1.setMontant(15000);
			commande1.setClient(client1);
			commandeRepository.save(commande1);

			Commande commande2 = new Commande();
			commande2.setTrackingId(UUID.randomUUID());
			commande2.setNumeroCommande(1002);
			commande2.setMontant(25000);
			commande2.setClient(client2);
			commandeRepository.save(commande2);

			Commande commande3 = new Commande();
			commande3.setTrackingId(UUID.randomUUID());
			commande3.setNumeroCommande(1003);
			commande3.setMontant(8500);
			commande3.setClient(client1);
			commandeRepository.save(commande3);

			Commande commande4 = new Commande();
			commande4.setTrackingId(UUID.randomUUID());
			commande4.setNumeroCommande(1004);
			commande4.setMontant(12000);
			commande4.setClient(client3);
			commandeRepository.save(commande4);

			System.out.println("Données initiales créées avec succès !");
			System.out.println("Clients créés : " + clientRepository.count());
			System.out.println("Commandes créées : " + commandeRepository.count());
		};
	}

}
