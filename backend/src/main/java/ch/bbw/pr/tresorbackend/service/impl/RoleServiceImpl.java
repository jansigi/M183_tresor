package ch.bbw.pr.tresorbackend.service.impl;

import ch.bbw.pr.tresorbackend.model.Role;
import ch.bbw.pr.tresorbackend.repository.RoleRepository;
import ch.bbw.pr.tresorbackend.service.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * UserServiceImpl
 *
 * @author Peter Rutschmann
 */
@Service
@AllArgsConstructor
public class RoleServiceImpl implements RoleService {

    private RoleRepository roleRepository;

    @Override
    public Role getUserRole() {
        return roleRepository.findById(1L).get();
    }

    @Override
    public Role getAdminRole() {
        return roleRepository.findById(2L).get();
    }
}
