package org.library.uca.service;

import java.util.Collection;
import java.util.List;

import org.library.uca.model.domain.entity.Author;
import org.library.uca.model.front.web.queryparams.AuthorQueryParams;

public interface AuthorService {

	List<Author> findAll();
	
	List<Author> findByCriteria(AuthorQueryParams authorQueryParams);

	String getChainedAuthorNames(Collection<Author> authors);

}