package ch.bbw.pr.tresorbackend.repository;

import ch.bbw.pr.tresorbackend.model.Role;
import ch.bbw.pr.tresorbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository
 *
 * @author Jan Sigrist
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findById(Long id);
}
