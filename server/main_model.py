from transformers import pipeline
import logging
import sys
import re
import pandas as pd
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', 
                   handlers=[logging.StreamHandler(sys.stdout)])
logger = logging.getLogger(__name__)

# Global classifier
classifier = None

# Department list based on the unique departments in the dataset
DEPARTMENTS = [
    "Human Resources", "Engineering", "Sales", "Marketing", "Accounting"
]

# Department name mapping for common variations and abbreviations
DEPARTMENT_MAPPING = {
    "hr": "Human Resources",
    "human resources": "Human Resources",
    "human resource": "Human Resources",
    "personnel": "Human Resources",
    "eng": "Engineering",
    "engineering": "Engineering",
    "software": "Engineering",
    "tech": "Engineering",
    "technology": "Engineering",
    "development": "Engineering",
    "dev": "Engineering",
    "it": "Engineering",
    "programming": "Engineering",
    "sales": "Sales",
    "sale": "Sales",
    "marketing": "Marketing",
    "market": "Marketing",
    "advertising": "Marketing",
    "accounting": "Accounting",
    "finance": "Accounting",
    "financial": "Accounting",
    "bookkeeping": "Accounting"
}

def load_classifier(model_name="facebook/bart-large-mnli"):
    """Load the zero-shot classification model."""
    try:
        print("Loading classifier model...")
        return pipeline("zero-shot-classification", model=model_name, framework="pt")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        raise

def classify_query(classifier, query, labels, hypothesis_template=None, multi_label=False):
    """Classify a query using zero-shot classification."""
    try:
        if hypothesis_template:
            result = classifier(query, candidate_labels=labels, hypothesis_template=hypothesis_template, multi_label=multi_label)
        else:
            result = classifier(query, candidate_labels=labels, multi_label=multi_label)
        return result
    except Exception as e:
        logger.error(f"Error during classification: {e}")
        raise

def is_corporate_related(query, classifier, confidence_threshold=0.45):
    """Determine if the query is related to corporate or employee data using multiple checks."""
    try:
        # Clean and normalize the query
        query = query.strip()
        
        # Define broader more specific categories with enhanced security detection
        corporate_labels = [
            "employee data request", 
            "hr question", 
            "corporate policy",
            "business operations",
            "performance metrics",
            "company data",
            "technical work request",
            "development inquiry",
            "engineering question",
            "project management",
            "system administration",
            "software development",
            "technical documentation",
            "code repository access",
            "development standards",
            "security violation",
            "data breach attempt",
            "unauthorized access request",
            "sensitive information query",
            "confidential data access",
            "financial data request",
            "salary information query",
            "personal employee information",
            "system administration query",
            "database access request"
        ]
        
        non_corporate_labels = [
            "personal question",
            "entertainment topic",
            "food and recipes",
            "general knowledge",
            "lifestyle question",
            "inappropriate content",
            "spam content",
            "malicious query",
            "social engineering attempt"
        ]
        
        # Combined labels for classification
        all_labels = corporate_labels + non_corporate_labels
        
        # Enhanced check for obviously non-corporate keywords and security threats
        non_corporate_keywords = {
            "inappropriate": ["sex", "porn", "nude", "tinder", "girlfriend", "boyfriend", "marry"],
            "entertainment": ["joke", "movie", "game", "play", "music", "song", "concert", "netflix"],
            "food": ["pancake", "recipe", "food", "cook", "restaurant", "meal", "dinner", "lunch", "breakfast"],
            "lifestyle": ["vacation", "hobby", "garden", "pet", "dog", "cat"],
            "security_threats": ["hack", "crack", "exploit", "bypass", "inject", "malware", "virus", "phishing", "steal", "leak"],
            "suspicious_requests": ["all passwords", "admin access", "backdoor", "root access", "dump database", "full database", "entire system"]
        }
        
        # Enhanced security pattern detection
        security_red_flags = [
            r'\ball\s+(employees|users|passwords|data)\b',
            r'\bentire\s+(database|system|company)\b',
            r'\bdump\s+(data|database|table)\b',
            r'\bfull\s+(access|list|dump)\b',
            r'\bshow\s+(all|every|entire)\b',
            r'\bgive\s+me\s+(all|everything|complete)\b',
            r'\bpassword\s+(list|file|database)\b',
            r'\badmin\s+(credentials|password|access)\b',
            r'\bunauthorized\s+access\b',
            r'\bbypass\s+(security|authentication)\b'
        ]
        
        # Check for non-corporate keywords and security threats
        for category, keywords in non_corporate_keywords.items():
            for keyword in keywords:
                if re.search(r'\b' + keyword + r'\b', query.lower()):
                    logger.warning(f"Detected {category} keyword '{keyword}' - flagging as inappropriate")
                    if category == "security_threats" or category == "suspicious_requests":
                        return False, "security violation", 1.0, {"security violation": 1.0}
                    else:
                        return False, f"{category} question", 1.0, {f"{category} question": 1.0}
        
        # Check for security red flag patterns
        for pattern in security_red_flags:
            if re.search(pattern, query.lower()):
                logger.warning(f"Detected security red flag pattern: {pattern}")
                return False, "security violation", 1.0, {"security violation": 1.0}
        
        # First classification: corporate vs non-corporate
        domain_result = classify_query(
            classifier,
            query,
            ["corporate business query", "non-corporate personal query"],
            hypothesis_template="This is a {}"
        )
        
        # Extract domain classification results
        domain_label = domain_result['labels'][0]
        domain_score = domain_result['scores'][0]
        
        # If high confidence that it's non-corporate, reject immediately
        if domain_label == "non-corporate personal query" and domain_score >= 0.70:
            logger.info(f"Rejected query as non-corporate with confidence {domain_score:.2f}")
            return False, "non-corporate query", domain_score, {"non-corporate query": domain_score}
        
        # Second classification: specific topic
        result = classify_query(
            classifier, 
            query, 
            all_labels, 
            hypothesis_template="This query is about {}",
            multi_label=True
        )
        
        # Get all scores
        scores = {label: score for label, score in zip(result['labels'], result['scores'])}
        
        # Corporate keyword detection (stronger signals) with security awareness
        corporate_keywords = [
            "employee", "staff", "personnel", "department", "hr", "company", 
            "corporate", "business", "organization", "management", "team", 
            "performance", "review", "salary", "policy", "finance", "budget",
            "training", "certification", "project", "office", "workplace",
            # Development and technical work keywords
            "development", "coding", "programming", "software", "application",
            "backend", "frontend", "database", "api", "system", "technology",
            "engineering", "code", "technical", "infrastructure", "platform",
            "architecture", "implementation", "deployment", "maintenance",
            # Additional engineering keywords
            "frontend", "backend", "fullstack", "javascript", "typescript", 
            "react", "angular", "vue", "node", "python", "java", "docker",
            "kubernetes", "aws", "cloud", "microservices", "repository",
            "git", "github", "deployment", "devops", "testing", "debugging"
        ]
        
        # Legitimate data request patterns
        legitimate_patterns = [
            r'\bmy\s+(salary|performance|training)\b',
            r'\bour\s+(team|department|project)\b',
            r'\bcompany\s+(policy|guidelines|procedures)\b',
            r'\bhow\s+to\s+(submit|request|apply)\b',
            r'\bwhat\s+is\s+(the|our)\s+(policy|procedure)\b',
            # Development and work-related patterns
            r'\bcode\s+for\s+(the|our)?\s*(backend|frontend|development|project)\b',
            r'\b(backend|frontend|development)\s+(code|work|project|team)\b',
            r'\b(technical|development|engineering)\s+(documentation|guidelines|standards)\b',
            r'\bwork\s+on\s+(the|our)?\s*(project|system|application)\b',
            r'\b(programming|coding|development)\s+(standards|practices|guidelines)\b',
            # Engineering-specific patterns
            r'\bshow\s+(frontend|backend|code|technical|development)\b',
            r'\bdisplay\s+(frontend|backend|code|engineering)\b',
            r'\bview\s+(code|development|engineering|technical)\b',
            r'\b(frontend|backend|development|engineering)\s+(code|dashboard|tools)\b'
        ]
        legitimate_patterns = [
            r'\bmy\s+(salary|performance|training)\b',
            r'\bour\s+(team|department|project)\b',
            r'\bcompany\s+(policy|guidelines|procedures)\b',
            r'\bhow\s+to\s+(submit|request|apply)\b',
            r'\bwhat\s+is\s+(the|our)\s+(policy|procedure)\b',
            # Development and work-related patterns
            r'\bcode\s+for\s+(the|our)?\s*(backend|frontend|development|project)\b',
            r'\b(backend|frontend|development)\s+(code|work|project|team)\b',
            r'\b(technical|development|engineering)\s+(documentation|guidelines|standards)\b',
            r'\bwork\s+on\s+(the|our)?\s*(project|system|application)\b',
            r'\b(programming|coding|development)\s+(standards|practices|guidelines)\b'
        ]
        
        # Check if there are explicit corporate keywords
        has_corporate_keywords = any(keyword in query.lower() for keyword in corporate_keywords)
        
        # Check for legitimate request patterns
        has_legitimate_patterns = any(re.search(pattern, query.lower()) for pattern in legitimate_patterns)
        
        # Enhanced security scoring
        security_score = 0
        
        # Count suspicious words that might indicate over-broad requests
        suspicious_quantifiers = ["all", "every", "entire", "complete", "full", "total"]
        suspicious_count = sum(1 for word in suspicious_quantifiers if word in query.lower())
        
        # Reduce legitimacy if too many suspicious quantifiers
        if suspicious_count >= 2:
            security_score += 0.3
            logger.warning(f"Multiple suspicious quantifiers detected: {suspicious_count}")
        
        # Check for overly broad department requests
        if "all departments" in query.lower() or "every department" in query.lower():
            security_score += 0.4
            logger.warning("Overly broad department request detected")
        
        # Get highest scores for corporate and non-corporate categories
        highest_corporate_score = max([scores.get(label, 0) for label in corporate_labels])
        highest_non_corporate_score = max([scores.get(label, 0) for label in non_corporate_labels])
        
        # Get predicted label and confidence
        predicted_label = result['labels'][0]
        confidence = result['scores'][0]
        
        # Enhanced decision logic with security scoring
        is_corporate = False
        
        # If security score is too high, flag as security violation
        if security_score >= 0.5:
            logger.warning(f"High security score detected: {security_score}")
            return False, "security violation", security_score, {"security violation": security_score}
        
        # Case 1: Strong corporate keyword presence with reasonable score and legitimate patterns
        if has_corporate_keywords and highest_corporate_score >= 0.35:
            # Additional check: if legitimate patterns exist, boost confidence
            if has_legitimate_patterns:
                is_corporate = True
                confidence_boost = 0.15  # Increased boost for legitimate patterns
                adjusted_confidence = min(1.0, highest_corporate_score + confidence_boost)
            else:
                # Without legitimate patterns, be more cautious but still consider strong keywords
                if highest_corporate_score >= 0.45:  # Slightly lowered threshold
                    is_corporate = True
                    adjusted_confidence = highest_corporate_score
                else:
                    logger.info("Corporate keywords detected but no legitimate patterns - requiring higher confidence")
                    adjusted_confidence = highest_corporate_score
            
            if is_corporate:
                # Find the actual highest corporate label
                for label in corporate_labels:
                    if scores.get(label, 0) == highest_corporate_score:
                        predicted_label = label
                        confidence = adjusted_confidence
                        break
        
        # Case 2: Corporate score significantly higher than non-corporate
        elif highest_corporate_score > highest_non_corporate_score + 0.15:
            is_corporate = True
            # Find the actual highest corporate label
            for label in corporate_labels:
                if scores.get(label, 0) == highest_corporate_score:
                    predicted_label = label
                    confidence = highest_corporate_score
                    break
        
        # Case 3: Standard threshold for corporate labels
        elif predicted_label in corporate_labels and confidence >= confidence_threshold:
            is_corporate = True
        
        # Additional check: if domain classification is strongly corporate, give benefit of doubt
        if not is_corporate and domain_label == "corporate business query" and domain_score >= 0.80:
            is_corporate = True
            predicted_label = "business operations"  # Default to a general business category
            confidence = domain_score
        
        # Special case for development/technical work queries that might be misclassified
        if not is_corporate and has_corporate_keywords:
            # Check for development-specific keywords
            dev_keywords = ["code", "development", "backend", "frontend", "programming", "software", "technical", "engineering", "dashboard", "api", "system"]
            has_dev_keywords = any(keyword in query.lower() for keyword in dev_keywords)
            
            if has_dev_keywords and highest_corporate_score >= 0.20:  # Even lower threshold for dev queries
                logger.info(f"Development query detected with corporate keywords - overriding classification")
                is_corporate = True
                predicted_label = "technical work request"
                confidence = max(0.65, highest_corporate_score)  # Minimum confidence for dev queries
        
        # Additional special case: if query contains "show" + engineering terms, likely legitimate
        if not is_corporate:
            show_patterns = [
                r'\bshow\s+(frontend|backend|code|engineering|development|technical|dashboard|system)\b',
                r'\bdisplay\s+(frontend|backend|code|engineering|development|technical|dashboard|system)\b',
                r'\bview\s+(frontend|backend|code|engineering|development|technical|dashboard|system)\b'
            ]
            
            for pattern in show_patterns:
                if re.search(pattern, query.lower()):
                    logger.info(f"Engineering display request detected: '{query}' - overriding classification")
                    is_corporate = True
                    predicted_label = "engineering question"
                    confidence = 0.70
                    break
        
        logger.info(f"Classification result: corporate={is_corporate}, label={predicted_label}, confidence={confidence:.2f}")
        logger.debug(f"All scores: {scores}")
        
        return is_corporate, predicted_label, confidence, scores
    
    except Exception as e:
        logger.error(f"Error in corporate relevance check: {e}")
        raise

def analyze_query_security_risk(query):
    """Analyze the security risk level of a query based on various factors.
    
    Args:
        query (str): The user query to analyze
        
    Returns:
        float: Security risk score (0.0 = low risk, 1.0 = high risk)
        dict: Details about detected risks
    """
    risk_score = 0.0
    risk_details = {}
    
    query_lower = query.lower()
    
    # 1. Check for overly broad requests
    broad_quantifiers = ["all", "every", "entire", "complete", "full", "total", "everything"]
    broad_count = sum(1 for word in broad_quantifiers if word in query_lower)
    if broad_count >= 2:
        risk_score += 0.3
        risk_details["overly_broad"] = f"Multiple broad quantifiers: {broad_count}"
    
    # 2. Check for sensitive data keywords
    sensitive_keywords = ["password", "salary", "ssn", "social security", "bank", "credit card", "personal"]
    sensitive_count = sum(1 for keyword in sensitive_keywords if keyword in query_lower)
    if sensitive_count > 0:
        risk_score += 0.2 * sensitive_count
        risk_details["sensitive_data"] = f"Sensitive keywords: {sensitive_count}"
    
    # 3. Check for technical/system keywords that might indicate malicious intent
    technical_keywords = ["database", "server", "admin", "root", "system", "config", "dump", "export"]
    technical_count = sum(1 for keyword in technical_keywords if keyword in query_lower)
    if technical_count >= 2:
        risk_score += 0.25
        risk_details["technical_focus"] = f"Technical keywords: {technical_count}"
    
    # 4. Check query length and complexity
    word_count = len(query.split())
    if word_count > 20:  # Very long queries might be attempting to confuse the system
        risk_score += 0.1
        risk_details["query_length"] = f"Long query: {word_count} words"
    
    # 5. Check for urgent/pressure language
    pressure_words = ["urgent", "immediately", "asap", "emergency", "critical", "now"]
    pressure_count = sum(1 for word in pressure_words if word in query_lower)
    if pressure_count > 0:
        risk_score += 0.15
        risk_details["pressure_language"] = f"Pressure words: {pressure_count}"
    
    return min(1.0, risk_score), risk_details

def extract_requested_department(query):
    """Extract the department name from a query.
    
    Args:
        query (str): The user query
        
    Returns:
        str or None: The standardized department name or None if no department found
    """
    try:
        # Clean and normalize query
        query = query.lower().strip()
        
        # First, check for direct department mentions using the mapping
        for dept_variant, standard_name in DEPARTMENT_MAPPING.items():
            # Create flexible pattern that matches the department variant
            patterns = [
                r'\b' + re.escape(dept_variant) + r'\s+department\b',
                r'\b' + re.escape(dept_variant) + r'\s+team\b',
                r'\b' + re.escape(dept_variant) + r'\s+staff\b',
                r'\bin\s+' + re.escape(dept_variant) + r'\b',
                r'\bfrom\s+' + re.escape(dept_variant) + r'\b',
                r'\bof\s+' + re.escape(dept_variant) + r'\b',
                r'\b' + re.escape(dept_variant) + r'\b'
            ]
            
            for pattern in patterns:
                if re.search(pattern, query):
                    logger.info(f"Found department mention: {standard_name} (matched: {dept_variant})")
                    return standard_name
        
        # Check for cross-departmental queries first
        cross_dept_patterns = [
            r'\beach\s+department\b',
            r'\ball\s+departments?\b',
            r'\bevery\s+department\b',
            r'\bdepartments?\s+(breakdown|summary|overview|analysis)\b',
            r'\bby\s+department\b',
            r'\bacross\s+departments?\b',
            r'\bmultiple\s+departments?\b'
        ]
        
        # Check for general employee data requests that HR should handle
        general_employee_patterns = [
            r'\bview\s+employee\s+data\b',
            r'\bemployee\s+data\b',
            r'\bemployee\s+information\b',
            r'\bstaff\s+data\b',
            r'\bpersonnel\s+data\b',
            r'\bemployee\s+records?\b',
            r'\bstaff\s+records?\b',
            r'\bpersonnel\s+records?\b',
            r'\ball\s+employees?\b',
            r'\bemployee\s+list\b',
            r'\bstaff\s+list\b',
            r'\bemployee\s+directory\b'
        ]
        
        # Check if this is a cross-departmental query
        for pattern in cross_dept_patterns:
            if re.search(pattern, query):
                logger.info(f"Detected cross-departmental query: {pattern}")
                return "ALL_DEPARTMENTS"  # Special marker for cross-departmental queries
        
        # Check if this is a general employee data request
        for pattern in general_employee_patterns:
            if re.search(pattern, query):
                logger.info(f"Detected general employee data request: {pattern}")
                return "ALL_DEPARTMENTS"  # HR should handle general employee data requests
        
        # Enhanced department indicators with more flexible patterns
        department_indicators = [
            # Pattern for "employees in X department"
            (r'\bemployees?\s+in\s+(\w+(?:\s+\w+)?)\s*(?:department|team|staff)?\b', 1),
            # Pattern for "how many in X"
            (r'\bhow\s+many\s+(?:in\s+)?(\w+(?:\s+\w+)?)\s*(?:department|team)?\b', 1),
            # Pattern for "X department data"
            (r'\b(\w+(?:\s+\w+)?)\s+department\b', 1),
            # Pattern for "X team"
            (r'\b(\w+(?:\s+\w+)?)\s+team\b', 1),
            # Pattern for "data from X"
            (r'\bdata\s+from\s+(\w+(?:\s+\w+)?)\b', 1),
            # Pattern for "get X information"
            (r'\bget\s+(\w+(?:\s+\w+)?)\s+information\b', 1),
            # Pattern for "access to X"
            (r'\baccess\s+to\s+(\w+(?:\s+\w+)?)\b', 1),
            # Pattern for "from X department"
            (r'\bfrom\s+(\w+(?:\s+\w+)?)\s+department\b', 1),
            # Pattern for "for X department"
            (r'\bfor\s+(\w+(?:\s+\w+)?)\s+department\b', 1),
            # Pattern for "in X department"
            (r'\bin\s+(\w+(?:\s+\w+)?)\s+department\b', 1),
            # Pattern for "of X department"
            (r'\bof\s+(\w+(?:\s+\w+)?)\s+department\b', 1)
        ]
        
        potential_departments = []
        
        for pattern, group in department_indicators:
            matches = re.finditer(pattern, query)
            for match in matches:
                try:
                    dept = match.group(group).strip()
                    if dept and len(dept) > 1:  # Ignore single characters
                        logger.debug(f"Extracted potential department: '{dept}' using pattern: {pattern}")
                        
                        # Check if this extracted term maps to a known department
                        if dept.lower() in DEPARTMENT_MAPPING:
                            potential_departments.append(DEPARTMENT_MAPPING[dept.lower()])
                            logger.info(f"Mapped '{dept}' to {DEPARTMENT_MAPPING[dept.lower()]}")
                        # Try partial matching for compound terms like "software development"
                        else:
                            for known_dept, standard_name in DEPARTMENT_MAPPING.items():
                                if (known_dept in dept.lower() or 
                                    any(word in dept.lower() for word in known_dept.split()) or
                                    dept.lower() in known_dept):
                                    potential_departments.append(standard_name)
                                    logger.info(f"Partial match: '{dept}' mapped to {standard_name}")
                                    break
                except Exception as e:
                    logger.debug(f"Error processing match: {e}")
                    continue
                        
        # Return the first found department or None
        if potential_departments:
            # Remove duplicates while preserving order
            unique_departments = list(dict.fromkeys(potential_departments))
            logger.info(f"Final department detection result: {unique_departments[0]}")
            return unique_departments[0]
        
        logger.info("No department detected in query")
        return None
    
    except Exception as e:
        logger.error(f"Error extracting department: {e}")
        return None

def check_authorization(employee_id, employee_dept, requested_dept, employee_info=None):
    """Check if an employee is authorized to access data from a requested department.
    Enhanced with security threat detection and behavioral analysis.
    
    Args:
        employee_id (str): ID of the employee making the request
        employee_dept (str): Department of the employee making the request
        requested_dept (str): Department whose data is being requested
        employee_info (dict): Additional employee information including past_violations, join_date, ip_address
        
    Returns:
        bool: True if authorized, False otherwise
        str: Reason for authorization decision
    """
    try:
        # If no specific department was requested/detected
        if not requested_dept:
            logger.warning("No specific department detected in the query")
            return False, "No specific department detected in the query"
        
        # Handle cross-departmental queries
        if requested_dept == "ALL_DEPARTMENTS":
            logger.info("Cross-departmental query detected")
            
            # Only HR and special roles can access cross-departmental data
            if employee_dept == "Human Resources":
                logger.info(f"HR employee {employee_id} authorized for cross-departmental/employee data query")
                return True, "HR authorized for employee data and cross-departmental access"
            
            # Check if user has special role with broad access
            try:
                employee_id_int = int(employee_id)
                special_roles = {
                    10: ["Human Resources", "Engineering", "Sales", "Marketing"],  # HR admin
                    16: ["Human Resources", "Accounting"],  # HR lead
                    13: ["Accounting", "Sales", "Marketing"],  # Finance director
                }
                
                if employee_id_int in special_roles:
                    # For cross-departmental queries, check if they have access to multiple departments
                    accessible_depts = special_roles[employee_id_int]
                    if len(accessible_depts) >= 3:  # Can access 3+ departments
                        logger.info(f"Special role user {employee_id} authorized for cross-departmental query")
                        return True, f"Special role with broad access authorized for cross-departmental data"
                    
            except (ValueError, TypeError):
                pass
            
            # Deny cross-departmental access for regular employees
            logger.warning(f"Employee {employee_id} from {employee_dept} denied cross-departmental/employee data access")
            return False, "Employee data and cross-departmental queries require HR or special role authorization"
        
        # Enhanced security checks based on additional factors
        security_risk_score = 0
        
        if employee_info:
            # 1. Check IP address - localhost (127.0.0.1) gets special treatment
            ip_address = employee_info.get('ip_address', '')
            is_localhost = ip_address == '127.0.0.1' or ip_address == 'localhost'
            
            # 2. Check past violations - more granular risk assessment
            past_violations = employee_info.get('past_violations', 0)
            try:
                past_violations = int(past_violations)
            except (ValueError, TypeError):
                past_violations = 0
            
            # Calculate security risk based on violations
            if past_violations >= 3:
                security_risk_score += 1.0  # High risk
            elif past_violations >= 2:
                security_risk_score += 0.7  # Medium-high risk
            elif past_violations >= 1:
                security_risk_score += 0.3  # Low-medium risk
                
            # 3. Check join date - newer employees might have more restrictions
            join_date = employee_info.get('join_date', '')
            is_new_employee = False
            
            if join_date:
                try:
                    from datetime import datetime
                    # Check if join_date is a datetime object or a string
                    if isinstance(join_date, str):
                        # Try different date formats
                        try:
                            join_date_obj = datetime.strptime(join_date, '%Y-%m-%d')
                        except ValueError:
                            try:
                                join_date_obj = datetime.strptime(join_date, '%d/%m/%Y')
                            except ValueError:
                                try:
                                    join_date_obj = datetime.strptime(join_date, '%m/%d/%Y')
                                except ValueError:
                                    # If all parsing attempts fail, default to not a new employee
                                    join_date_obj = None
                    else:
                        join_date_obj = join_date
                    
                    if join_date_obj:
                        today = datetime.now()
                        months_employed = (today.year - join_date_obj.year) * 12 + (today.month - join_date_obj.month)
                        is_new_employee = months_employed < 3  # Less than 3 months at company
                        
                        # Add risk for very new employees
                        if months_employed < 1:
                            security_risk_score += 0.4
                        elif months_employed < 3:
                            security_risk_score += 0.2
                except Exception as e:
                    logger.warning(f"Error processing join date: {e}")
            
            # Enhanced security decision logic
            logger.info(f"Security risk score for employee {employee_id}: {security_risk_score}")
            
            # Automatic rejection for very high security risk - but with exceptions
            if security_risk_score >= 1.0:
                # Exception: HR users accessing their own department or employee data
                if employee_dept == "Human Resources" and (requested_dept == "Human Resources" or requested_dept == "ALL_DEPARTMENTS"):
                    logger.info(f"HR employee {employee_id} with high risk score granted access to HR/employee data due to job requirements")
                    # Continue with normal authorization flow instead of blocking
                else:
                    logger.warning(f"Employee {employee_id} has very high security risk score - access denied")
                    return False, f"Access denied due to high security risk (score: {security_risk_score:.1f})"
            
            # Special case: New employees with past violations have heavily restricted access
            if is_new_employee and past_violations > 0:
                # New employees with violations can only access their own department
                if employee_dept != requested_dept:
                    logger.warning(f"New employee {employee_id} with past violations - restricted to own department")
                    return False, "New employees with past violations can only access their own department"
            
            # Medium-high risk employees get restricted cross-department access
            if security_risk_score >= 0.5 and employee_dept != requested_dept:
                logger.warning(f"Medium-high risk employee {employee_id} requesting cross-department access")
                return False, f"Cross-department access restricted due to security risk (score: {security_risk_score:.1f})"
            
            # Localhost gets elevated privileges (typically for admin/dev purposes)
            if is_localhost:
                logger.info(f"Request from localhost ({ip_address}) - granting elevated access")
                return True, "Localhost connection with elevated access"
        
        # Always allow employees to access their own department's data
        if employee_dept == requested_dept:
            logger.info(f"Employee {employee_id} authorized to access their own department ({employee_dept})")
            return True, "Access to own department data"
        
        # Special roles with broader access
        # Ensure employee_id is converted to int for comparison with dictionary keys
        try:
            employee_id_int = int(employee_id)
        except (ValueError, TypeError):
            # If it can't be converted to int, it won't match any special role keys
            employee_id_int = None
        
        special_roles = {
            # Format: employee_id: [departments_with_access]
            10: ["Human Resources", "Engineering", "Sales", "Marketing"],  # HR admin with access to multiple departments
            16: ["Human Resources", "Accounting"],  # HR lead with finance access
            13: ["Accounting", "Sales", "Marketing"],  # Finance director
        }
        
        # Check for special roles - using the integer ID for comparison
        if employee_id_int is not None and employee_id_int in special_roles and requested_dept in special_roles[employee_id_int]:
            # If employee has past violations, extra scrutiny even with special role
            if employee_info and past_violations > 0:
                logger.warning(f"Special role user {employee_id} has {past_violations} violations - applying conditional restrictions")
                # Be more lenient with HR accessing their own department or employee data
                if employee_dept == "Human Resources" and (requested_dept == "Human Resources" or requested_dept == "ALL_DEPARTMENTS"):
                    logger.info(f"HR special role user {employee_id} granted access despite violations for critical HR functions")
                elif past_violations >= 3:
                    return False, f"Special role restricted due to {past_violations} violations"
            
            logger.info(f"Employee {employee_id} has special role authorization for {requested_dept}")
            return True, f"Special role authorization for {requested_dept}"
        
        # Cross-department access rules
        cross_dept_access = {
            "Human Resources": DEPARTMENTS,  # HR can access all departments
            "Accounting": ["Sales", "Marketing"],  # Finance can access revenue departments
            "Engineering": [],  # Engineering has limited cross-department access
        }
        
        # Check cross-department access rules - with added restriction for employees with violations
        if employee_dept in cross_dept_access and requested_dept in cross_dept_access[employee_dept]:
            # If employee has past violations, extra scrutiny for cross-department access
            if employee_info and past_violations > 0:
                # Be more lenient with HR users accessing other departments as it's part of their job
                if employee_dept == "Human Resources" and past_violations < 5:  # Allow HR with fewer than 5 violations
                    logger.info(f"HR employee {employee_id} with {past_violations} violations granted cross-dept access for HR functions")
                else:
                    logger.warning(f"Employee {employee_id} has {past_violations} violations - restricted cross-dept access")
                    return False, f"Cross-department access restricted due to past violations"
                
            logger.info(f"Employee from {employee_dept} has cross-department authorization for {requested_dept}")
            return True, f"Cross-department authorization from {employee_dept} to {requested_dept}"
        
        # Default: no access
        logger.warning(f"Employee {employee_id} from {employee_dept} NOT authorized to access {requested_dept}")
        return False, f"No authorization from {employee_dept} to {requested_dept}"
    
    except Exception as e:
        logger.error(f"Error in authorization check: {e}")
        # Default to denying access on error
        return False, f"Authorization error: {str(e)}"

def process_result(is_related, predicted_label, confidence, employee_info=None, query=None):
    """Process and display classification results with authorization check."""
    print(f"Prediction: {predicted_label} (confidence: {confidence:.2f})")
    
    if not is_related:
        print("❌ Non-corporate query - Do not respond")
        return False
    
    # If we have employee info, perform authorization check
    if employee_info and query:
        # Extract employee details
        employee_id = employee_info.get('id', 'unknown')
        employee_dept = employee_info.get('department', 'unknown')
        
        # Extract requested department from query
        requested_dept = extract_requested_department(query)
        
        if requested_dept:
            print(f"📊 Department requested: {requested_dept}")
            
            # Check authorization with full employee info
            is_authorized, reason = check_authorization(employee_id, employee_dept, requested_dept, employee_info)
            
            if is_authorized:
                print(f"✅ AUTHORIZED: {reason}")
                print(f"✅ Corporate/Business query with valid authorization - Generate response")
                return True
            else:
                print(f"❌ UNAUTHORIZED: {reason}")
                print(f"❌ Corporate/Business query but unauthorized - Block response")
                return False
        else:
            print("⚠️ No specific department detected in the query")
            print("✅ Corporate/Business query - Generate general response")
            return True
    else:
        # No authorization check needed/possible
        print("✅ Corporate/Business query - Generate response")
        return True

# --- New User Query Processing Functions ---

def load_user_data(csv_path="MOCK_DATA.csv"):
    """Load user data from CSV file"""
    try:
        df = pd.read_csv(csv_path)
        # Convert join_date to datetime if it exists
        if 'join_date' in df.columns:
            df['join_date'] = pd.to_datetime(df['join_date'], format='%d/%m/%Y', errors='coerce')
        return df
    except Exception as e:
        logger.error(f"Error loading user data: {e}")
        raise

def get_user_by_id(user_id, user_data):
    """Get user details by ID"""
    try:
        # Convert user_id to int if it's numeric
        try:
            user_id = int(user_id)
        except ValueError:
            pass
            
        user = user_data[user_data['id'] == user_id]
        if user.empty:
            logger.warning(f"User with ID {user_id} not found")
            return None
        return user.iloc[0].to_dict()
    except Exception as e:
        logger.error(f"Error retrieving user by ID: {e}")
        return None

def process_user_query(user_id, query):
    """Process a user query with authentication and classification
    
    Args:
        user_id: User ID to look up in CSV
        query: The query text to classify
        
    Returns:
        dict: Response with query status, classification, and authorization details
    """
    global classifier
    
    # Make sure classifier is loaded
    if classifier is None:
        classifier = load_classifier()
    
    try:
        # Load user data
        user_data = load_user_data()
        
        # Get user information
        user = get_user_by_id(user_id, user_data)
        if not user:
            return {
                "status": "error",
                "message": f"User with ID {user_id} not found",
                "query": query,
                "is_appropriate": False
            }
        
        # Ensure past_violations is an integer
        try:
            user['past_violations'] = int(user.get('past_violations', 0))
        except (ValueError, TypeError):
            user['past_violations'] = 0
        
        # Rename department field for compatibility with existing code
        user['department'] = user.get('dept')
        
        # Classify the query
        is_corporate, predicted_label, confidence, scores = is_corporate_related(query, classifier)
        
        # Perform additional security risk analysis
        security_risk, risk_details = analyze_query_security_risk(query)
        
        result = {
            "query": query,
            "is_appropriate": is_corporate,
            "label": predicted_label,
            "confidence": float(confidence),
            "user_id": user_id,
            "user_dept": user.get('dept', ''),
            "user_name": f"{user.get('first_name', '')} {user.get('last_name', '')}"
        }
        
        # Enhanced security check: if security risk is very high, reject even corporate queries
        if security_risk >= 0.8:
            logger.warning(f"High security risk detected: {security_risk:.2f}, Details: {risk_details}")
            result["status"] = "rejected"
            result["message"] = f"Query rejected due to high security risk (score: {security_risk:.2f})"
            result["is_appropriate"] = False
            result["label"] = "security violation"
            result["requested_dept"] = ""
            result["is_authorized"] = False
            result["auth_reason"] = f"High security risk: {risk_details}"
            return result
        
        # Medium security risk gets flagged for additional review
        if security_risk >= 0.5:
            logger.info(f"Medium security risk detected: {security_risk:.2f}, Details: {risk_details}")
            # Continue processing but add security context to the response
        
        # If non-corporate, check for special cases before rejecting
        if not is_corporate:
            # Special case: Engineering department users with technical queries
            user_dept = user.get('dept', '').lower()
            if user_dept == 'engineering':
                # Check if query contains engineering-specific keywords
                engineering_keywords = [
                    'frontend', 'backend', 'code', 'development', 'programming',
                    'engineering', 'technical', 'software', 'application', 'system',
                    'dashboard', 'api', 'database', 'architecture', 'deployment'
                ]
                
                query_lower = query.lower()
                has_engineering_terms = any(keyword in query_lower for keyword in engineering_keywords)
                
                # If it's an engineering query from engineering department, allow it
                if has_engineering_terms:
                    logger.info(f"Allowing engineering query '{query}' for Engineering department user")
                    # Reclassify as corporate engineering query
                    is_corporate = True
                    predicted_label = "engineering question"
                    confidence = 0.8  # Set reasonable confidence
                    result["is_appropriate"] = True
                    result["label"] = predicted_label
                    result["confidence"] = confidence
                else:
                    # Not an engineering query, reject as normal
                    result["status"] = "rejected"
                    result["message"] = "Query is not related to corporate matters"
                    result["requested_dept"] = ""
                    result["is_authorized"] = None
                    result["auth_reason"] = None
                    return result
            else:
                # Non-engineering users with non-corporate queries are rejected
                result["status"] = "rejected"
                result["message"] = "Query is not related to corporate matters"
                result["requested_dept"] = ""
                result["is_authorized"] = None
                result["auth_reason"] = None
                return result
        
        # Extract requested department from the query
        requested_dept = extract_requested_department(query)
        result["requested_dept"] = requested_dept if requested_dept else ""
        
        # Handle cross-departmental queries
        if requested_dept == "ALL_DEPARTMENTS":
            result["requested_dept"] = "ALL_DEPARTMENTS"
            # Check authorization for cross-departmental access
            try:
                is_authorized, reason = check_authorization(user_id, user.get('dept'), requested_dept, user)
                result["is_authorized"] = is_authorized
                result["auth_reason"] = reason
                
                if is_authorized:
                    result["status"] = "approved"
                    result["message"] = f"Employee data query approved: {reason}"
                else:
                    result["status"] = "unauthorized"
                    result["message"] = f"Employee data query unauthorized: {reason}"
            except Exception as auth_error:
                logger.error(f"Authorization check failed: {auth_error}")
                result["status"] = "error"
                result["message"] = f"Authorization check failed: {str(auth_error)}"
                result["is_authorized"] = False
                result["auth_reason"] = "Error during authorization check"
            
            return result
        
        # If no specific department was requested
        if not requested_dept:
            result["status"] = "approved"
            result["message"] = "Corporate query with no specific department requested"
            result["is_authorized"] = None
            result["auth_reason"] = None
            return result
        
        # Check authorization
        try:
            is_authorized, reason = check_authorization(user_id, user.get('dept'), requested_dept, user)
            result["is_authorized"] = is_authorized
            result["auth_reason"] = reason
            
            if is_authorized:
                result["status"] = "approved"
                result["message"] = f"Query approved: {reason}"
            else:
                result["status"] = "unauthorized"
                result["message"] = f"Query unauthorized: {reason}"
        except Exception as auth_error:
            logger.error(f"Authorization check failed: {auth_error}")
            result["status"] = "error"
            result["message"] = f"Authorization check failed: {str(auth_error)}"
            result["is_authorized"] = False
            result["auth_reason"] = "Error during authorization check"
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        return {
            "status": "error",
            "message": str(e),
            "query": query,
            "is_appropriate": False
        }

def test_examples(classifier):
    """Test the classifier with various examples."""
    test_queries = [
        # Clear non-corporate queries
        "Tell me about sex",
        "How to make pancakes",
        "Tell me a joke about programming",
        "What movies are playing this weekend",
        "How do I train my dog",
        
        # Clear corporate queries
        "Show me employees who joined after 2022",
        "What departments have the most employees?",
        "List HR policy violations",
        "What is our company's profit margin this quarter?",
        "Who has the most training sessions completed?",
        
        # Borderline or ambiguous queries
        "What is the gender distribution in Engineering?",
        "Tell me about work-life balance",
        "How do I file a complaint?",
        "What are the office hours?",
        "Can I get information about employee benefits?"
    ]
    
    print("\n===== TESTING VARIOUS QUERIES =====")
    
    for query in test_queries:
        print(f"\nQuery: {query}")
        is_corporate, predicted_label, confidence, scores = is_corporate_related(query, classifier)
        
        # Display top 3 scores for this query
        print("Top classification scores:")
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        for label, score in sorted_scores[:3]:
            print(f"  {label}: {score:.2f}")
        
        response_status = "✅ CORPORATE" if is_corporate else "❌ NON-CORPORATE"
        print(f"Result: {response_status} - {predicted_label} ({confidence:.2f})")
    
    print("\n===== END OF TEST =====")

def test_authorization_examples(classifier):
    """Test the classifier with authorization examples."""
    # Sample employee data for testing
    test_employees = [
        {"id": "EMP001", "name": "John Doe", "department": "Human Resources", "ip_address": "192.168.1.101", "join_date": "2020-01-15", "past_violations": 0},
        {"id": "EMP002", "name": "Jane Smith", "department": "Engineering", "ip_address": "192.168.1.102", "join_date": "2019-05-20", "past_violations": 1},
        {"id": "EMP003", "name": "Bob Johnson", "department": "Sales", "ip_address": "192.168.1.103", "join_date": "2022-11-10", "past_violations": 0},
        {"id": "HR001", "name": "Admin User", "department": "Human Resources", "ip_address": "127.0.0.1", "join_date": "2018-03-01", "past_violations": 0},
        {"id": "EMP004", "name": "Alice Brown", "department": "Marketing", "ip_address": "192.168.1.104", "join_date": "2023-01-05", "past_violations": 2},
        {"id": "EMP005", "name": "Charlie Wilson", "department": "Engineering", "ip_address": "192.168.1.105", "join_date": "2022-12-01", "past_violations": 3},
    ]
    
    test_queries = [
        # Department-specific queries
        "What is the programming language used in the company?",
        "Show me the Engineering team's project status",
        "List all employees in the Sales department",
        "What's the budget for the Marketing department?",
        "How many people work in HR?",
        
        # General queries
        "What's the company holiday policy?",
        "When is the next company meeting?",
        "How do I submit my timesheet?",
    ]
    
    print("\n===== TESTING ENHANCED AUTHORIZATION SYSTEM =====")
    
    for employee in test_employees:
        print(f"\n👤 EMPLOYEE: {employee['name']} (ID: {employee['id']}, Dept: {employee['department']})")
        print(f"   Join Date: {employee['join_date']}, IP: {employee['ip_address']}, Past Violations: {employee['past_violations']}")
        
        for query in test_queries:
            print(f"\nQuery: {query}")
            is_corporate, predicted_label, confidence, scores = is_corporate_related(query, classifier)
            
            # If corporate-related, do authorization check
            if is_corporate:
                # Get the department being requested
                requested_dept = extract_requested_department(query)
                if requested_dept:
                    print(f"Department requested: {requested_dept}")
                    
                    # Check authorization with enhanced factors
                    is_authorized, reason = check_authorization(
                        employee['id'], 
                        employee['department'], 
                        requested_dept,
                        employee
                    )
                    
                    auth_status = "✅ AUTHORIZED" if is_authorized else "❌ UNAUTHORIZED"
                    print(f"Authorization: {auth_status} - {reason}")
                else:
                    print("⚠️ No specific department detected in query")
            
            # Process the full result
            process_result(is_corporate, predicted_label, confidence, employee, query)
            print("-" * 50)
    
    print("\n===== END OF ENHANCED AUTHORIZATION TEST =====")

def test_department_extraction():
    """Test the department extraction functionality"""
    test_queries = [
        "how many employees in software department",
        "show me engineering team data",
        "get HR information",
        "employees in tech department",
        "sales team performance",
        "marketing department budget",
        "accounting staff list",
        "finance team members",
        "development team size",
        "IT department employees",
        # Cross-departmental queries
        "How many employees work in each department?",
        "Show me all departments breakdown",
        "What's the employee count by department?",
        "List employees across all departments",
        "Department-wise headcount analysis",
        # General employee data queries
        "View employee data",
        "Employee data",
        "Show me employee information",
        "All employees",
        "Employee list",
        "Staff records"
    ]
    
    print("\n===== TESTING DEPARTMENT EXTRACTION =====")
    
    for query in test_queries:
        dept = extract_requested_department(query)
        print(f"Query: '{query}' -> Department: {dept}")
    
    print("\n===== END OF DEPARTMENT EXTRACTION TEST =====")

def test_user_query_processing():
    """Test the processing of user queries with CSV-based user data"""
    # Make sure the classifier is loaded
    global classifier
    if classifier is None:
        classifier = load_classifier()
    
    # Test queries with user IDs
    test_cases = [
        (10, "Show me the list of employees in the Engineering department"),
        (5, "Tell me about our HR policies"),
        (13, "What is the sales revenue for last quarter?"),
        (2, "How do I make pancakes?"),
        (16, "Can I access the accounting database?"),
        (6, "Give me salary data for all departments"),
        (99, "Hello world"),  # Non-existent user
        # Test the specific case from user's issue
        (1, "How many employees work in each department?"),  # HR user asking cross-departmental question
        (3, "How many employees work in each department?"),  # Non-HR user asking same question
        # Test development-related queries
        (1, "code for the backend development"),  # HR user asking about development work
        (2, "What are our coding standards?"),  # Engineering user asking about development
        (1, "Show me the technical documentation"),  # HR user asking about technical docs
        # Test general employee data queries
        (1, "View employee data"),  # HR user should be authorized for this
        (3, "View employee data"),  # Non-HR user should be unauthorized
        (1, "Employee information"),  # HR user asking for employee info
    ]
    
    print("\n===== TESTING USER QUERY PROCESSING =====")
    
    for user_id, query in test_cases:
        print(f"\n===== Processing Query =====")
        print(f"User ID: {user_id}")
        print(f"Query: {query}")
        
        result = process_user_query(user_id, query)
        
        print("\nResult:")
        for key, value in result.items():
            print(f"{key}: {value}")
        print("=" * 50)
    
    print("\n===== END OF USER QUERY TEST =====")

def main():
    try:
        # Load zero-shot classifier
        global classifier
        classifier = load_classifier()
        
        # Test department extraction first
        test_department_extraction()
        
        # Run test examples
        # test_examples(classifier)
        
        # Run authorization test examples
        # test_authorization_examples(classifier)
        
        # Test user query processing with CSV data
        test_user_query_processing()
        
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    
    return True

if __name__ == "__main__":
    main()
