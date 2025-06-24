package ch.bbw.pr.tresorbackend.service;

import ch.bbw.pr.tresorbackend.model.Role;
import ch.bbw.pr.tresorbackend.model.User;

import java.util.List;

/**
 * RoleService
 *
 * @author Jan Sigrist
 */
public interface RoleService {
    Role getUserRole();

    Role getAdminRole();
}
